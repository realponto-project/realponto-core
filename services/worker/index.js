// const mercadoLibreJs = require('../mercadoLibre')
const { Worker } = require('worker_threads')
const { splitEvery, inc, length, equals } = require('ramda')
const path = require('path')

const notificationService = require('../notification')

class WorkerServices {
  getAllItemsIdBySellerId({
    date,
    tokenFcm,
    accessToken,
    seller_id,
    companyId,
    mlAccountId
  }) {
    let coutWorkersFinished = 0
    const worker = new Worker(
      path.join(__dirname, 'getAllItemsIdBySellerId.js')
    )

    worker.once('message', (list) => {
      console.log('itemsId list: ', list)
      const listSplited = splitEvery(1000, list)

      for (const listSlice of listSplited) {
        const workerListSlice = new Worker(
          path.join(__dirname, 'getItemsByItemsId.js'),
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

  updateAds({ rows, ajdustPriceString }) {
    const listSplited = splitEvery(1000, rows)

    for (const listSlice of listSplited) {
      const workerUpdateAds = new Worker(path.join(__dirname, 'updateAds.js'))
      workerUpdateAds.once('message', (message) => {
        console.log(`${workerUpdateAds.threadId} `, message)
      })
      workerUpdateAds.on('error', console.error)
      workerUpdateAds.on('exit', () => {
        console.log('exit')
      })
      console.log(`Iniciando worker de ID ${workerUpdateAds.threadId}`)
      workerUpdateAds.postMessage({ list: listSlice, ajdustPriceString })
    }
  }

  updateAdsByAccount({ account, list }) {
    const listSplited = splitEvery(1000, list)

    for (const listSlice of listSplited) {
      const workerUpdateAdsByAccount = new Worker(
        path.join(__dirname, 'updateAdsByAccount.js')
      )
      workerUpdateAdsByAccount.once('message', (message) => {
        console.log(`${workerUpdateAdsByAccount.threadId} `, message)
      })
      workerUpdateAdsByAccount.on('error', console.error)
      workerUpdateAdsByAccount.on('exit', () => console.log('exit'))
      console.log(`Iniciando worker de ID ${workerUpdateAdsByAccount.threadId}`)
      workerUpdateAdsByAccount.postMessage({ list: listSlice, account })
    }
  }
}

module.exports = new WorkerServices()
