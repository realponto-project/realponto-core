const Queue = require('bull')
const redisConfig = require('./configRedis')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)

const mlAds = [{
  id: 'MLB1902336836',
  price: 300.99,
}, {
  id: 'MLB1884028445',
  price: 588.99,
}]

const enQueue = (job) => {
  instanceQueue.add(job)
}

module.exports = enQueue
