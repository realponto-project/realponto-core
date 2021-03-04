const { compare } = require('bcrypt')
const jwt = require('jsonwebtoken')
const { pathOr, omit } = require('ramda')
const database = require('../../database')
const UserModel = database.model('user')

const secret = 'process.env.SECRET'

const authentication = async (req, res, next) => {
  const email = pathOr(null, ['body', 'email'], req)
  const password = pathOr(null, ['body', 'password'], req)

 try {
  const user = await UserModel.findOne({ where: { email }, raw: true })
  const userWithoutPwd = omit(['password'], user)
  const checkedPassword = await compare(password, user.password)

  if(!checkedPassword) {
    throw new Error('Email or password do not match')
  }

  const token = jwt.sign({ user: userWithoutPwd }, secret, { expiresIn: '24h'})
  res.json({ ...userWithoutPwd, token })

 } catch (error) {
   res.status(400).json({ errors: [{ error: error.name, message: error.message }]})
 }

}

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']

  if(token) {
    jwt.verify(token.slice(7, token.length), secret, (err, decoded) => {
      if(err) {
        return res.status(403).json({
          success: false,
          message: 'Token is not valid'
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).json({
      success: false,
      message: 'Auth token is not supplied'
    })
  }
}

module.exports = {
  authentication,
  checkToken,
}
