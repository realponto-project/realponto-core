const { pathOr } = require('ramda')

const database = require('../../database')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const mercadoLibreJs = require('../../services/mercadoLibre')
const tokenGenerate = require('../../utils/helpers/tokenGenerate')

const createAccount = async (req, res, next) => {
  const transaction = await database.transaction()
  const code = pathOr({}, ['body', 'code'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const user = pathOr(null, ['decoded', 'user'], req)
  const sellersMercadoLibre = pathOr(
    [],
    ['decoded', 'sellersMercadoLibre'],
    req
  )

  try {
    const autorizationMl = await mercadoLibreJs.authorization.token(code)

    const userDataMl = await mercadoLibreJs.user.myInfo(
      pathOr(null, ['data', 'access_token'], autorizationMl)
    )

    const accountMl = await MercadoLibreDomain.create({
      fullname: `${pathOr(null, ['data', 'first_name'], userDataMl)} ${pathOr(
        null,
        ['data', 'last_name'],
        userDataMl
      )}`,
      sellerId: pathOr(null, ['data', 'id'], userDataMl),
      companyId
    })

    const parserSellers = sellersMercadoLibre.find(
      (seller) =>
        seller &&
        seller.user_id === pathOr(null, ['data', 'user_id'], autorizationMl)
    )
      ? sellersMercadoLibre
      : [...sellersMercadoLibre, pathOr([], ['data'], autorizationMl)]

    res.status(201).json({
      token: tokenGenerate({ user, sellersMercadoLibre: parserSellers }),
      accountMl
    })
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getAllAccounts = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await MercadoLibreDomain.getAll({ companyId })
    res.status(201).json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAccount = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const id = pathOr(null, ['params', 'id'], req)
  try {
    const response = await MercadoLibreDomain.getById({ companyId, id })
    res.status(201).json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createAccount,
  getAllAccounts,
  getAccount
}
