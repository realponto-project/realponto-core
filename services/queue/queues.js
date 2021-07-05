const Queue = require('bull')

const redisConfig = require('./configRedis')

const updateAdsOnDBQueue = new Queue('update ads on database', redisConfig)
const adsQueue = new Queue('loader ads', redisConfig)
const refreshTokenQueue = new Queue('refresh token', redisConfig)
const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)
const pingServerQueue = new Queue('ping server', redisConfig)

module.exports = {
  adsQueue,
  refreshTokenQueue,
  updateAdsOnDBQueue,
  reprocessQueue,
  pingServerQueue
}
