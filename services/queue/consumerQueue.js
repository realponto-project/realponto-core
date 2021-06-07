const Queue = require('bull')
const { pathOr, propEq, omit, find } = require('ramda')

const database = require('../../database')
const mercadoLibreJs = require('../mercadoLibre')
const redisConfig = require('./configRedis')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const { adsQueue, refreshTokenQueue } = require('./queues')
const notificationService = require('../../services/notification')

const MlAccountAdModel = database.model('mercado_libre_account_ad')
const MlAccountModel = database.model('mercado_libre_account')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)
const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)

instanceQueue.process(async (job) => {
  const { tokenFcm } = job.data
  try {
    await mercadoLibreJs.ads.update(job.data)

    const mercadoLibreAccountAd = await MlAccountAdModel.findOne({
      where: { item_id: job.data.id }
    })

    await mercadoLibreAccountAd.update({
      type_sync: true,
      update_status: 'updated'
    })

    const count = await instanceQueue.count()

    if (count === 0 && tokenFcm) {
      await notificationService.SendNotification({
        notification: {
          title: 'Completo',
          body:
            'O serviço que atualiza os anúncios do mercado liver foi cloncluído'
        },
        token: tokenFcm
      })
    }
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
      'start_time',
      'date_created'
    ])

    data.forEach(async ({ code, body }) => {
      if (code === 200) {
        const attributes = pathOr([], ['attributes'], body)
        const sku = find(propEq('id', 'SELLER_SKU'), attributes)
        if (sku) {
          await MercadoLibreDomain.createOrUpdateAd({
            ...omit(['attributes'], body),
            companyId,
            mlAccountId,
            sku
          })
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
