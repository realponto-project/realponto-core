const Queue = require('bull')
const mercadoLibreJs = require('../mercadoLibre')
const redisConfig = require('./configRedis')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)
const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)

instanceQueue.process(async (job) => {
  try {
    await mercadoLibreJs.ads.update(job.data)
  } catch (error) {
    reprocessQueue.add(job.data)
  }
})
