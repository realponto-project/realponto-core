const { map, forEach } = require('ramda')
const { parentPort } = require('worker_threads')

const mercadoLibreJs = require('../../services/mercadoLibre')
const database = require('../../database')

const MlAccountAdModel = database.model('mercado_libre_account_ad')

parentPort.once('message', async ({ list, account }) => {
  const { access_token } = account

  await Promise.all(
    map(async ({ id }) => {
      const accountAd = await MlAccountAdModel.findByPk(id)

      await accountAd.update({ update_status: 'waiting_update' })
    }, list)
  )

  forEach(async ({ id, item_id, price }, index) => {
    console.log(id, item_id, price)
    mercadoLibreJs.ads
      .update(access_token, item_id, { price })
      .then(async () => {
        const accountAd = await MlAccountAdModel.findByPk(id)

        await accountAd.update({ type_sync: true, update_status: 'updated' })
      })
      .catch(async () => {
        const accountAd = await MlAccountAdModel.findByPk(id)

        await accountAd.update({ update_status: 'error' })
      })
  }, list)
})
