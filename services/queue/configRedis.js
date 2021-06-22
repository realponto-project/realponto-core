const redisConfig = process.env.REDISCLOUD_URL || {
  redis: {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = redisConfig
