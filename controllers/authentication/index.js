const jwt = require('jsonwebtoken')
const { pathOr } = require('ramda')

const database = require('../../database')

const UserModel = database.model('user')
const MlAccountModel = database.model('mercadoLibreAccount')

const secret = process.env.SECRET_KEY_JWT || 'mySecretKey'

const authentication = async (req, res, next) => {
  const email = pathOr(null, ['body', 'email'], req)
  const password = pathOr(null, ['body', 'password'], req)

  try {
    const user = await UserModel.findOne({ where: { email } })

    if (!user || !user.activated) {
      throw new Error('User activated not found')
    }

    if (!(await user.checkPassword(password))) {
      throw new Error('Email or password do not match')
    }
    const userWithoutPwd = await UserModel.findByPk(user.id, {
      raw: true,
      attributes: { exclude: ['password'] }
    })

    const companyId = userWithoutPwd.companyId

    const sellersMercadoLibre = await MlAccountModel.findAll({
      where: {
        companyId
      },
      attributes: [
        'id',
        'fullname',
        'sellerId',
        'access_token',
        'refresh_token'
      ],
      raw: true
    })

    const token = jwt.sign(
      { user: userWithoutPwd, sellersMercadoLibre },
      secret,
      {
        expiresIn: '24h'
      }
    )
    res.json({ ...userWithoutPwd, token })
  } catch (error) {
    res
      .status(400)
      .json({ errors: [{ error: error.name, message: error.message }] })
  }
}

const checkToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization

  if (token) {
    jwt.verify(token.slice(7, token.length), secret, (err, decoded) => {
      if (err) {
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
  checkToken
}
