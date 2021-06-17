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
  add
} = require('ramda')

const database = require('../../database')
const mercadoLibreJs = require('../mercadoLibre')
const redisConfig = require('./configRedis')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const { adsQueue, refreshTokenQueue, updateAdsOnDBQueue } = require('./queues')
const evalString = require('../../utils/helpers/eval')

const MlAdModel = database.model('mercadoLibreAd')
const MlAccountModel = database.model('mercadoLibreAccount')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)
const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)

instanceQueue.process(async (job) => {
  try {
    console.log(job.data)
    await mercadoLibreJs.ads.update(job.data)

    const mercadoLibreAd = await MlAdModel.findOne({
      where: { item_id: job.data.id }
    })

    await mercadoLibreAd.update({
      update_status: 'updated'
    })
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
  console.log('object')
  try {
    const { list, access_token, companyId, mlAccountId } = job.data

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
      console.log(code)
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
  } catch (error) {
    console.log('>>', error.message)
  }
})

updateAdsOnDBQueue.process(async (job) => {
  try {
    const { sku, price, ajdustPriceString, companyId } = job.data
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
      console.log(JSON.stringify(ad, null, 2), newPrice)
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
