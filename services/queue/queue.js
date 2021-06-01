const Queue = require('bull')
const redisConfig = require('./configRedis')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)

const enQueue = (job) => {
  instanceQueue.add(job)
}

module.exports = enQueue
