// const mercadoLibreJs = require('../mercadoLibre')
const { Worker } = require('worker_threads')
const { splitEvery, inc, length, equals } = require('ramda')

const notificationService = require('../notification')

class WorkerServices {
  async getAllItemsIdBySellerId({
    date,
    tokenFcm,
    accessToken,
    seller_id,
    companyId,
    mlAccountId
  }) {
    let coutWorkersFinished = 0
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

        workerListSlice.on('exit', async () => {
          coutWorkersFinished = inc(coutWorkersFinished)

          console.log('exit')
          if (equals(length(listSplited), coutWorkersFinished)) {
            console.log('send notification')

            await notificationService.SendNotification({
              notification: {
                title: 'Completo',
                body:
                  'O serviço que sincroniza os com os anúncios do mercado liver foi cloncluído'
              },
              token: tokenFcm
            })
          }
        })

        console.log(`Iniciando worker de ID ${workerListSlice.threadId}`)
        workerListSlice.postMessage({ list: listSlice, date })
      }
    })
    worker.on('error', console.error)

    console.log(`Iniciando worker de ID ${worker.threadId}`)
    worker.postMessage({ accessToken, seller_id })

    worker.on('exit', () => console.log('exit'))
  }
}

module.exports = new WorkerServices()
