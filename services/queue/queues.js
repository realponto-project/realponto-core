const Queue = require('bull')

const redisConfig = require('./configRedis')

const adsQueue = new Queue('loader ads', redisConfig)
const refreshTokenQueue = new Queue('refresh token', redisConfig)

module.exports = {
  adsQueue,
  refreshTokenQueue
}
