const Queue = require('bull')
const {
  pathOr,
  propEq,
  omit,
  find,
  multiply,
  map,
  pipe,
  forEach,
  remove,
  length,
  join,
  split,
  add
} = require('ramda')

const database = require('../../database')
const mercadoLibreJs = require('../mercadoLibre')
const redisConfig = require('./configRedis')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const { adsQueue, refreshTokenQueue, updateAdsOnDBQueue } = require('./queues')
const notificationService = require('../../services/notification')
const evalString = require('../../utils/helpers/eval')

const MlAccountAdModel = database.model('mercado_libre_account_ad')
const MlAdModel = database.model('mercado_libre_ad')
const MlAccountModel = database.model('mercado_libre_account')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)
const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)

instanceQueue.process(async (job) => {
  // const { tokenFcm } = job.data
  try {
    await mercadoLibreJs.ads.update(job.data)

    const mercadoLibreAccountAd = await MlAccountAdModel.findOne({
      where: { item_id: job.data.id }
    })

    const teste = await mercadoLibreAccountAd.update({
      type_sync: true,
      update_status: 'updated'
    })

    await teste.save()

    // const count = await instanceQueue.count()

    // if (count === 0 && tokenFcm) {
    //   await notificationService.SendNotification({
    //     notification: {
    //       title: 'Completo',
    //       body:
    //         'O serviço que atualiza os anúncios do mercado liver foi cloncluído'
    //     },
    //     token: tokenFcm
    //   })
    // }
  } catch (error) {
    console.log('>>', error.message)
    if (error.response.status === 403) {
      const refreshTokenAccount = await MercadoLibreDomain.getRefreshToken(
        job.data.accountId
      )

      const newToken = await mercadoLibreJs.authorization.refreshToken(
        refreshTokenAccount
      )

      await MercadoLibreDomain.setNewToken(job.data.accountId, newToken.data)
      instanceQueue.add(job.data)
    } else {
      reprocessQueue.add(job.data)
    }
  }
})

adsQueue.process(async (job) => {
  try {
    const { list, access_token, companyId, mlAccountId, tokenFcm } = job.data

    const { data } = await mercadoLibreJs.item.multiget(access_token, list, [
      'id',
      'title',
      'price',
      'status',
      'seller_custom_field',
      'attributes',
      'variations',
      'start_time',
      'date_created'
    ])

    data.forEach(async ({ code, body }) => {
      if (code === 200) {
        const variations = pathOr([], ['variations'], body)
        const attributes = pathOr([], ['attributes'], body)

        forEach(async (variation) => {
          const sku = find(propEq('id', 'SELLER_SKU'), variation.attributes)
          if (sku) {
            const transaction = await database.transaction()

            try {
              await MercadoLibreDomain.createOrUpdateAd(
                {
                  ...omit(['attributes'], body),
                  id: join('-', [body.id, String(variation.id)]),
                  companyId,
                  mlAccountId,
                  sku
                },
                { transaction }
              )
              await transaction.commit()
            } catch (err) {
              console.error('error >>> >>', err)
              await transaction.rollback()
            }
          }
        }, variations)

        const sku = find(propEq('id', 'SELLER_SKU'), attributes)

        if (sku) {
          const transaction = await database.transaction()

          try {
            await MercadoLibreDomain.createOrUpdateAd(
              {
                ...omit(['attributes'], body),
                companyId,
                mlAccountId,
                sku
              },
              { transaction }
            )

            await transaction.commit()
          } catch (err) {
            console.error('error >>> >>', err)
            await transaction.rollback()
          }
        }
      }
    })

    const count = await adsQueue.count()

    if (count === 0 && tokenFcm) {
      await notificationService.SendNotification({
        notification: {
          title: 'Completo',
          body:
            'O serviço que carrega os anúncios do mercado livre foi cloncluído'
        },
        token: tokenFcm
      })
    }
  } catch (error) {
    console.log('>>', error.message)
  }
})

updateAdsOnDBQueue.process(async (job) => {
  try {
    const { sku, price, ajdustPriceString, companyId } = job.data
    const ajdustPrice = evalString(ajdustPriceString)

    const ads = await MlAdModel.findAll({
      where: { parse_sku: String(sku), company_id: companyId },
      include: MlAccountAdModel
    })

    forEach(async (ad) => {
      const multiplicador = pipe(
        remove(0, length(ad.parse_sku)),
        join(''),
        split('-'),
        join('')
      )(ad.sku)
      const newPrice = pipe(
        multiply(multiplicador || 1),
        ajdustPrice,
        (value) => value.toFixed(2),
        Number,
        Math.floor,
        add(0.87)
      )(price)
      if (newPrice !== ad.price) {
        if (
          // newPrice > multiply(ad.price, 3) ||
          newPrice < multiply(ad.price, 0.7)
        ) {
          await Promise.all(
            map(async (mercado_libre_account_ad) => {
              await mercado_libre_account_ad.update({
                type_sync: false,
                update_status: 'error'
              })
            }, ad.mercado_libre_account_ads)
          )
          console.log('Há uma certa discrepância entre o novo preço e o antigo')
          console.log(newPrice, ad.price, ad.sku, ad.title)
        } else {
          await Promise.all(
            map(async (mercado_libre_account_ad) => {
              await mercado_libre_account_ad.update({
                type_sync: false,
                update_status: 'unupdated'
              })
            }, ad.mercado_libre_account_ads)
          )
          await ad.update({ price: newPrice })
          // forEach((mercado_libre_account_ad) => {
          //   enQueue({
          //     sku: ad.sku,
          //     id: mercado_libre_account_ad.item_id,
          //     price: newPrice,
          //     accountId: mercado_libre_account_ad.mercado_libre_account_id,
          //     tokenFcm
          //   })
          // }, ad.mercado_libre_account_ads)
        }
      } else {
        console.log('O preço se mantem igual')
      }
    }, ads)
  } catch (error) {
    console.log('>>>', error.message)
  }
})

refreshTokenQueue.process(async (job) => {
  try {
    const account = await MlAccountModel.findByPk(job.data.id)

    const {
      data: { refresh_token, access_token }
    } = await mercadoLibreJs.authorization.refreshToken(account.refresh_token)

    await MercadoLibreDomain.createOrUpdate({
      ...JSON.parse(JSON.stringify(account)),
      refresh_token,
      access_token
    })
  } catch (error) {
    console.log('>>', error.message)
  }
})
