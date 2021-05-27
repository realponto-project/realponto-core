const { concat } = require('ramda')
const { parentPort } = require('worker_threads')

const mercadoLibreJs = require('../mercadoLibre')

parentPort.once('message', async ({ accessToken, seller_id }) => {
  let itmesIdList = []
  let data = {}

  do {
    const response = await mercadoLibreJs.ads.get(
      accessToken,
      seller_id,
      data.scroll_id
    )

    data = response.data
    itmesIdList = concat(itmesIdList, data.results)
  } while (data.results.length > 0)
  parentPort.postMessage(itmesIdList)
})
