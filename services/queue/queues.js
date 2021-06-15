const Queue = require('bull')

// const redisConfig = require('./configRedis')
const redisConfig =
  'redis://default:Lyfix7RQhFJRspv9RTJmWbV8ZXy92KDy@redis-17449.c261.us-east-1-4.ec2.cloud.redislabs.com:17449'

const updateAdsOnDBQueue = new Queue('update ads on database', redisConfig)
const adsQueue = new Queue('loader ads', redisConfig)
const refreshTokenQueue = new Queue('refresh token', redisConfig)
const reprocessQueue = new Queue('reprocess ads mercado libre', redisConfig)

adsQueue.getJobCounts().then((resp) => console.log(resp))

module.exports = {
  adsQueue,
  refreshTokenQueue,
  updateAdsOnDBQueue,
  reprocessQueue
}
