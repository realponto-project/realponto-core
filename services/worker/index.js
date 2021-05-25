// const mercadoLibreJs = require('../mercadoLibre')
const { Worker } = require('worker_threads')
const { splitEvery } = require('ramda')

class WorkerServices {
  async getAllItemsIdBySellerId({
    accessToken,
    seller_id,
    companyId,
    mlAccountId
  }) {
    const worker = new Worker('./services/worker/getAllItemsIdBySellerId.js')
    worker.once('message', (list) => {
      console.log('itemsId list: ', list)
      const listSplited = splitEvery(1000, list)

      for (const listSlice of listSplited) {
        const workerListSlice = new Worker(
          './services/worker/getItemsByItemsId.js',
          { env: { accessToken, companyId, mlAccountId } }
        )

        workerListSlice.once('message', (message) => {
          console.log(`${workerListSlice.threadId} `, message)
        })
        workerListSlice.on('error', console.error)

        workerListSlice.on('exit', () => console.log('exit'))

        console.log(`Iniciando worker de ID ${workerListSlice.threadId}`)
        workerListSlice.postMessage(listSlice)
      }
    })
    worker.on('error', console.error)

    console.log(`Iniciando worker de ID ${worker.threadId}`)
    worker.postMessage({ accessToken, seller_id })
  }
}

module.exports = new WorkerServices()
