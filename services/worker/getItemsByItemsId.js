const { splitEvery, propEq, omit, pathOr, find } = require('ramda')
const { parentPort } = require('worker_threads')

const MercadoLibreDomain = require('../../domains/mercadoLibre')
const mercadoLibreJs = require('../mercadoLibre')

parentPort.once('message', async ({ list, date }) => {
  const { accessToken, companyId, mlAccountId } = process.env
  const listSplited = splitEvery(20, list)
  let shouldFinish = false

  for (const listSlice of listSplited) {
    if (shouldFinish) return
    const { data } = await mercadoLibreJs.item.multiget(
      accessToken,
      listSlice,
      [
        'id',
        'title',
        'price',
        'status',
        'seller_custom_field',
        'attributes',
        'start_time',
        'date_created'
      ]
    )

    data.forEach(async ({ code, body }) => {
      if (new Date(body.start_time) - new Date(date) < 0) shouldFinish = true
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
        } else {
          // console.log('not have sku')
        }
      }
    })
  }
})
