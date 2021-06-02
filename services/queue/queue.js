const Queue = require('bull')
const redisConfig = require('./configRedis')

const instanceQueue = new Queue('update ads mercado libre', redisConfig)

const ad = {
  id: 'MLB1902336836',
  price: 1,
}

const enQueue = (job) => {
  instanceQueue.add(job)
}

let i = 1
while(i < 45000) {
  enQueue({ ...ad, price: ad.price + 1 })
  i++
}

console.log('queue run...')
module.exports = enQueue
