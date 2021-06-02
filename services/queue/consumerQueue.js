const Queue = require('bull')
const mercadoLibreJs = require('../mercadoLibre')
const redisConfig = require('./configRedis')
const MercadoLibreDomain = require('../../domains/mercadoLibre')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)
const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)

instanceQueue.process(async (job) => {
  try {
    await mercadoLibreJs.ads.update(job.data)
  } catch (error) {
    if (error.status === 403) {
      const refreshTokenAccount = await MercadoLibreDomain.refreshToken(job.data.accountId)
      const newToken = await mercadoLibreJs.authorization.refreshToken(refreshTokenAccount)
      await MercadoLibreDomain.setNewToken(job.data.accountId, newToken)
      instanceQueue.add(job.data)
    } else {
      reprocessQueue.add(job.data)
    }
  }
})
