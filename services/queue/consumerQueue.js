const Queue = require('bull')
const {
  pathOr,
  propEq,
  omit,
  find,
  multiply,
  pipe,
  forEach,
  remove,
  length,
  join,
  split,
  add,
  map
} = require('ramda')

const database = require('../../database')
const mercadoLibreJs = require('../mercadoLibre')
const redisConfig = require('./configRedis')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const notificationService = require('../notification')
const { adsQueue, refreshTokenQueue, updateAdsOnDBQueue } = require('./queues')
const evalString = require('../../utils/helpers/eval')

const MlAdModel = database.model('mercadoLibreAd')
const LogErrorsModel = database.model('logError')
const MercadolibreAdLogErrorsModel = database.model('mercadolibreAdLogErrors')
const MlAccountModel = database.model('mercadoLibreAccount')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)
// const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)

instanceQueue.process(async (job) => {
  const { tokenFcm, index, total } = job.data
  const shouldSendNotification = index === total
  const message = {
    notification: {
      title: 'Alxa-ml',
      body: 'Todos os preços foram atualizados no Alxa-ml'
    },
    token: tokenFcm
  }

  try {
    await mercadoLibreJs.ads.update(job.data)

    const mercadoLibreAd = await MlAdModel.findOne({
      where: { item_id: job.data.id }
    })

    await mercadoLibreAd.update({
      update_status: 'updated'
    })

    if (shouldSendNotification) {
      console.log('send notification')
      await notificationService.SendNotification(message)
    }
  } catch (error) {
    console.error('instanceQueue >>', error.message)

    if (error.response.data.status === 429) {
      return instanceQueue.add(job.data)
    }

    if (shouldSendNotification) {
      console.log('send notification')
      await notificationService.SendNotification(message)
    }

    const mercadoLibreAd = await MlAdModel.findOne({
      where: { item_id: job.data.id }
    })

    await mercadoLibreAd.update({
      update_status: 'error'
    })

    const causes = pathOr([], ['response', 'data', 'cause'], error)

    await Promise.all(
      map(async (cause) => {
        const logError = await LogErrorsModel.findOrCreate({ where: cause })

        await MercadolibreAdLogErrorsModel.findOrCreate({
          where: {
            mercadoLibreAdId: job.data.mercadoLibreAdId,
            logErrorId: logError[0].id
          }
        })
      }, causes)
    )

    if (error.response.status === 401) {
      const refreshTokenAccount = await MercadoLibreDomain.getRefreshToken(
        job.data.accountId
      )

      const newToken = await mercadoLibreJs.authorization.refreshToken(
        refreshTokenAccount
      )

      await MercadoLibreDomain.setNewToken(job.data.accountId, newToken.data)
      instanceQueue.add(job.data)
    } else {
      // reprocessQueue.add(job.data)
    }
  }
  instanceQueue.removeJobs(job.id)
})

adsQueue.process(async (job) => {
  try {
    const {
      list,
      access_token,
      companyId,
      mlAccountId,
      tokenFcm,
      index,
      total
    } = job.data

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
              console.error('adsQueue >>', err)
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

    if (index === total) {
      console.log('send notification')
      await notificationService.SendNotification({
        notification: {
          title: 'Alxa-ml',
          body: 'Seus anúncios terminaram de ser carregados'
        },
        token: tokenFcm
      })
    }
  } catch (error) {
    if (error.response.data.status === 429) {
      return adsQueue.add(job.data)
    }
    console.error('>>', error.message)
  }
  adsQueue.removeJobs(job.id)
})

updateAdsOnDBQueue.process(async (job) => {
  try {
    const {
      sku,
      price,
      ajdustPriceString,
      companyId,
      tokenFcm,
      index,
      total
    } = job.data
    const ajdustPrice = evalString(ajdustPriceString)

    const ads = await MlAdModel.findAll({
      where: { parse_sku: String(sku), companyId }
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
          await ad.update({ update_status: 'error' })
        } else {
          await ad.update({ update_status: 'unupdated', price: newPrice })
        }
      } else {
        console.log('O preço se mantem igual')
      }
    }, ads)

    if (index === total) {
      console.log('send notification')
      await notificationService.SendNotification({
        notification: {
          title: 'Alxa-ml',
          body: 'Todos os preços foram atualizados no Alxa-ml'
        },
        token: tokenFcm
      })
    }
  } catch (error) {
    console.error('updateAdsOnDBQueue >>', error.message)
  }
  updateAdsOnDBQueue.removeJobs(job.id)
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
    console.error('refreshTokenQueue >>', error.message)
  }
})
