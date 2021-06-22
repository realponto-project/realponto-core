const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_KEY_JWT || 'mySecretKey'

const tokenGenerate = (data) => {
  const token = jwt.sign(data, secret, { expiresIn: '24h' })
  return token
}

module.exports = tokenGenerate
