const {
  pathOr,
  find,
  propEq,
  append,
  path,
  map,
  addIndex,
  multiply
} = require('ramda')

const jwt = require('jsonwebtoken')
const database = require('../../database')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const mercadoLibreJs = require('../../services/mercadoLibre')
const tokenGenerate = require('../../utils/helpers/tokenGenerate')
const workerServices = require('../../services/worker')
const evalString = require('../../utils/helpers/eval')

const MlAccountModel = database.model('mercado_libre_account')
const MlAdModel = database.model('mercado_libre_ad')
const MlAccountAdModel = database.model('mercado_libre_account_ad')
const CalcPriceModel = database.model('calcPrice')

const secret = process.env.SECRET_KEY_JWT || 'mySecretKey'

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

    const access_token = pathOr(null, ['data', 'access_token'], autorizationMl)
    const refresh_token = pathOr(
      null,
      ['data', 'refresh_token'],
      autorizationMl
    )
    const userDataMl = await mercadoLibreJs.user.myInfo(access_token)

    const accountMl = await MercadoLibreDomain.createOrUpdate(
      {
        fullname: `${pathOr(null, ['data', 'first_name'], userDataMl)} ${pathOr(
          null,
          ['data', 'last_name'],
          userDataMl
        )}`,
        sellerId: pathOr(null, ['data', 'id'], userDataMl),
        access_token,
        refresh_token,
        companyId
      },
      { transaction }
    )

    const findUserId = find(
      propEq('user_id', pathOr(null, ['data', 'user_id'], autorizationMl))
    )

    const parserSellers = findUserId(sellersMercadoLibre)
      ? sellersMercadoLibre
      : append(pathOr([], ['data'], autorizationMl), sellersMercadoLibre)

    transaction.commit()
    res.status(201).json({
      token: tokenGenerate({ user, sellersMercadoLibre: parserSellers }),
      accountMl
    })
  } catch (error) {
    await transaction.rollback()
    console.error(error)
    res.status(400).json({ error: error.message })
  }
}

const refreshToken = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const user = pathOr(null, ['decoded', 'user'], req)
  const id = pathOr(null, ['params', 'id'], req)
  const transaction = await database.transaction()

  try {
    const account = await MercadoLibreDomain.getById({
      companyId,
      id
    })

    const {
      data: { refresh_token, access_token }
    } = await mercadoLibreJs.authorization.refreshToken(account.refresh_token)

    await MercadoLibreDomain.createOrUpdate(
      {
        ...JSON.parse(JSON.stringify(account)),
        refresh_token,
        access_token
      },
      { transaction }
    )

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
      raw: true,
      transaction
    })

    const token = jwt.sign({ user, sellersMercadoLibre }, secret, {
      expiresIn: '24h'
    })

    res.json(token)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getAllAccounts = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await MercadoLibreDomain.getAll({ companyId })
    res.json(response)
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

const getAllAds = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = pathOr(null, ['query'], req)

  try {
    const { count: total, rows: source } = await MercadoLibreDomain.getAllAds({
      ...query,
      companyId
    })
    res.json({ total, source })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: error.message })
  }
}

const loadAds = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const mlAccountId = pathOr(null, ['params', 'mlAccountId'], req)
  const tokenFcm = pathOr(null, ['query', 'tokenFcm'], req)
  const date = pathOr(null, ['query', 'date'], req)

  const mlAccount = find(
    propEq('id', mlAccountId),
    pathOr([], ['decoded', 'sellersMercadoLibre'], req)
  )

  const accessToken = pathOr('', ['access_token'], mlAccount)

  try {
    const mlAccount = await MlAccountModel.findByPk(mlAccountId)

    // console.log(
    //   await mercadoLibreJs.authorization.refreshToken(mlAccount.refresh_token)
    // )

    if (!mlAccount) throw new Error('Account not found')

    const userDataMl = await mercadoLibreJs.user.myInfo(accessToken)

    const seller_id = path(['data', 'id'], userDataMl)

    workerServices.getAllItemsIdBySellerId({
      date,
      tokenFcm,
      accessToken,
      seller_id,
      companyId,
      mlAccountId
    })

    await mlAccount.update({ last_sync_ads: new Date() })

    res.json({ message: 'Worker started' })
  } catch (error) {
    console.log(error.message)

    res.status(400).json({ error: error.message })
  }
}

const updateAds = async (req, res, next) => {
  const transaction = await database.transaction()
  const { skuList, priceList, calcPriceId } = req.body

  try {
    const calcPrice = await CalcPriceModel.findByPk(calcPriceId, {
      transaction
    })

    const code = pathOr('value => value', ['code'], calcPrice)

    const ajdustPrice = evalString(code)

    await Promise.all(
      addIndex(map)(async (sku, index) => {
        const ad = await MlAdModel.findOne({
          where: { sku: String(sku) },
          include: MlAccountAdModel
        })
        const newPrice = ajdustPrice(priceList[index])
        if (
          newPrice > multiply(ad.price, 1.5) ||
          newPrice < multiply(ad.price, 0.7)
        ) {
          console.log('Há uma certa discrepância entre o novo preço e o antigo')
        } else {
          // console.log(JSON.stringify(ad, null, 2))
          await Promise.all(
            map(async (mercado_libre_account_ad) => {
              await mercado_libre_account_ad.update(
                { type_sync: false, update_status: 'unupdated' },
                { transaction }
              )
            }, ad.mercado_libre_account_ads)
          )
          await ad.update({ price: newPrice }, { transaction })
        }
      }, skuList)
    )
    await transaction.commit()
    res.json({ message: 'Preços atualizados' })
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createAccount,
  getAllAccounts,
  getAccount,
  getAllAds,
  loadAds,
  refreshToken,
  updateAds
}
