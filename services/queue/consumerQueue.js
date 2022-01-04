const Queue = require('bull')
const axios = require('axios').default
const yup = require('yup')
const {
  path,
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
  map,
  lte,
  ifElse,
  prop
} = require('ramda')

const database = require('../../database')
const mercadoLibreJs = require('../mercadoLibre')
const redisConfig = require('./configRedis')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const notificationService = require('../notification')
const {
  adsQueue,
  refreshTokenQueue,
  updateAdsOnDBQueue,
  notificationQueue
} = require('./queues')

const evalString = require('../../utils/helpers/eval')

const MlAdModel = database.model('mercadoLibreAd')
const LogErrorsModel = database.model('logError')
const MercadolibreAdLogErrorsModel = database.model('mercadolibreAdLogErrors')
const MlAccountModel = database.model('mercadoLibreAccount')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)

const removeCompletedJobs = async (queue) => {
  const completedJobs = await queue.getCompleted()

  await Promise.all(
    map(async ({ id }) => await queue.removeJobs(id), completedJobs)
  )
}

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
    await removeCompletedJobs(instanceQueue)
    const idUpdated = await MlAdModel.findByPk(job.data.mercadoLibreAdId)

    const isActive = prop('active', idUpdated)

    if (isActive) {
      await mercadoLibreJs.ads.update({ ...job.data })
      const mercadoLibreAd = await MlAdModel.findOne({
        where: { item_id: job.data.id }
      })

      await mercadoLibreAd.update({
        update_status: 'updated',
        shippingCost: lte(79, job.data.price)
          ? mercadoLibreAd.shippingCost
          : null,
        price_ml: job.data.price
      })
      if (shouldSendNotification) {
        console.log('send notification')
        await notificationService.SendNotification(message)
      }
    } else {
      console.log('Ad is not active')
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
    }
  }
  await instanceQueue.removeJobs(job.id)
})

adsQueue.process(async (job) => {
  try {
    await removeCompletedJobs(adsQueue)
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
                  ...omit(['attributes', 'price'], body),
                  id: join('-', [body.id, String(variation.id)]),
                  price: variation.price,
                  companyId,
                  mlAccountId,
                  sku
                },
                { transaction, changePrice: { origin: 'alxa' } }
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
              { transaction, changePrice: { origin: 'alxa' } }
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
  await adsQueue.removeJobs(job.id)
})

updateAdsOnDBQueue.process(async (job) => {
  try {
    await removeCompletedJobs(updateAdsOnDBQueue)

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
      const newCostPrice = pipe(
        multiply(multiplicador || 1),
        ajdustPrice,
        (value) => value.toFixed(2),
        Number
      )(price)

      const newPrice = pipe(
        multiply(1.5),
        ifElse(lte(72.99), add(ad.shippingCost || 6), add(6)),
        // add(ad.shippingCost || 6),
        (value) => value.toFixed(2),
        Number,
        Math.floor,
        add(0.87)
      )(newCostPrice)

      if (newPrice !== ad.price_ml) {
        if (
          newPrice > multiply(ad.price_ml, 2) ||
          newPrice < multiply(ad.price_ml, 0.7)
        ) {
          await ad.update(
            {
              update_status: 'not_update',
              price: newPrice,
              costPrice: newCostPrice
            },
            { changePrice: { origin: 'alxa' } }
          )
        } else {
          await ad.update(
            {
              update_status: 'unupdated',
              price: newPrice,
              costPrice: newCostPrice
            },
            { changePrice: { origin: 'alxa' } }
          )
        }
      } else {
        await ad.update(
          {
            update_status: 'updated',
            price: newPrice,
            costPrice: newCostPrice
          },
          { changePrice: { origin: 'alxa' } }
        )
        //   console.log('O preço se mantem igual')
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
  await updateAdsOnDBQueue.removeJobs(job.id)
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

const schemaJobData = yup.object().shape({
  topic: yup.string().required(),
  resource: yup.string().required(),
  user_id: yup.number().required().min(1).integer(),
  application_id: yup.number().required().min(1).integer(),
  sent: yup.date().required(),
  attempts: yup.number().required().min(1).integer(),
  received: yup.date().required()
})

notificationQueue.process(async (job) => {
  try {
    await removeCompletedJobs(notificationQueue)
    await schemaJobData.validate(job.data, { abortEarly: false })

    const user_id = path(['data', 'user_id'], job)
    const resource = path(['data', 'resource'], job)
    const topic = path(['data', 'topic'], job)

    if (topic === 'items') {
      const account = await MlAccountModel.findOne({
        where: { seller_id: user_id }
      })

      const url = `https://api.mercadolibre.com${resource}?include_attributes=all&attributes=id,title,price,status,seller_custom_field,attributes,variations,start_time,date_created,last_updated`
      const response = await axios.get(url, {
        headers: { authorization: `Bearer ${account.access_token}` }
      })

      const data = pathOr({}, ['data'], response)
      const variations = pathOr([], ['variations'], data)
      const attributes = pathOr([], ['attributes'], data)
      let shippingCost = null

      try {
        const shippingResp = await axios.get(
          `https://api.mercadolibre.com${resource}/shipping_options/free`,
          {
            headers: { authorization: `Bearer ${account.access_token}` }
          }
        )
        shippingCost = path(
          ['data', 'coverage', 'all_country', 'list_cost'],
          shippingResp
        )
      } catch (e) {}

      forEach(async (variation) => {
        const sku = find(propEq('id', 'SELLER_SKU'), variation.attributes)
        if (sku) {
          const transaction = await database.transaction()
          try {
            await MercadoLibreDomain.createOrUpdateAd(
              {
                ...omit(['attributes', 'variations', 'price'], data),
                shippingCost,
                id: join('-', [data.id, String(variation.id)]),
                price: variation.price,
                companyId: account.companyId,
                mlAccountId: account.id,
                sku
              },
              { transaction, changePrice: { origin: 'notification' } }
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
              ...omit(['attributes'], data),
              shippingCost,
              companyId: account.companyId,
              mlAccountId: account.id,
              sku
            },
            { transaction, changePrice: { origin: 'notification' } }
          )
          await transaction.commit()
        } catch (err) {
          console.error('error >>> >>', err)
          await transaction.rollback()
        }
      }
    }
  } catch (error) {
    console.error(error.message)

    if (error.response.data.status === 429) {
      return notificationQueue.add(job.data)
    }
  }
  await notificationQueue.removeJobs(job.id)
})
