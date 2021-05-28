const { map, forEach, multiply } = require('ramda')
const { parentPort } = require('worker_threads')

const database = require('../../database')
const evalString = require('../../utils/helpers/eval')

const MlAdModel = database.model('mercado_libre_ad')
const MlAccountAdModel = database.model('mercado_libre_account_ad')

parentPort.once('message', async ({ list, ajdustPriceString }) => {
  const ajdustPrice = evalString(ajdustPriceString)

  forEach(async ({ sku, price }, index) => {
    const ad = await MlAdModel.findOne({
      where: { sku: String(sku) },
      include: MlAccountAdModel
    })

    if (ad) {
      const newPrice = ajdustPrice(price)

      if (newPrice !== ad.price) {
        if (
          newPrice > multiply(ad.price, 10) ||
          newPrice < multiply(ad.price, 0.1)
        ) {
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
          const t = await ad.update({ price: newPrice })
          console.log('.>>>>>>>', t.price)
        }
      } else {
        console.log('O preço se mantem igual')
      }
    }
  }, list)
})
