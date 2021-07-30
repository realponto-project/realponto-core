const Queue = require('bull')

const redisConfig = require('./configRedis')

const updateAdsOnDBQueue = new Queue('update ads on database', redisConfig)
const adsQueue = new Queue('loader ads', redisConfig)
const refreshTokenQueue = new Queue('refresh token', redisConfig)
const notificationQueue = new Queue('notification queue', redisConfig)
const instanceQueue = new Queue('update ads mercado libre', redisConfig)

module.exports = {
  adsQueue,
  refreshTokenQueue,
  updateAdsOnDBQueue,
  notificationQueue,
  instanceQueue
}
