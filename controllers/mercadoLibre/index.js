const {
  pathOr,
  find,
  propEq,
  append,
  path,
  map,
  multiply,
  concat,
  splitEvery
} = require('ramda')

const database = require('../../database')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const mercadoLibreJs = require('../../services/mercadoLibre')
const tokenGenerate = require('../../utils/helpers/tokenGenerate')

const MlAccountModel = database.model('mercado_libre_account')
const MlAdModel = database.model('mercado_libre_ad')
const MlAccountAdModel = database.model('mercado_libre_account_ad')
const CalcPriceModel = database.model('calcPrice')

const enqueue = require('../../services/queue/queue')
const evalString = require('../../utils/helpers/eval')
const { adsQueue, refreshTokenQueue } = require('../../services/queue/queues')

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

    refreshTokenQueue.add(
      { id: accountMl.id },
      { repeat: { cron: '0 0/5 * * *' } }
    )

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

const updateAd = async (req, res, next) => {
  const transaction = await database.transaction()
  const price = pathOr(0, ['body', 'price'], req)
  const sku = pathOr(null, ['body', 'sku'], req)

  try {
    const response = await MercadoLibreDomain.updateAd(
      { price, sku },
      { transaction }
    )
    await mercadoLibreJs.ads.update(response)
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const loadAds = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const mlAccountId = pathOr(null, ['params', 'mlAccountId'], req)
  const tokenFcm = pathOr(null, ['query', 'tokenFcm'], req)

  try {
    const mlAccount = await MlAccountModel.findByPk(mlAccountId)

    if (!mlAccount) throw new Error('Account not found')

    const access_token = path(['access_token'], mlAccount)
    const userDataMl = await mercadoLibreJs.user.myInfo(access_token)

    const seller_id = path(['data', 'id'], userDataMl)

    let itmesIdList = []
    let data = {}

    do {
      const response = await mercadoLibreJs.ads.get(
        access_token,
        seller_id,
        data.scroll_id
      )

      data = response.data
      itmesIdList = concat(itmesIdList, data.results)
    } while (data.results.length > 0)

    const listSplited = splitEvery(20, itmesIdList)

    listSplited.forEach((list) => {
      adsQueue.add({ list, access_token, companyId, mlAccountId, tokenFcm })
    })

    await mlAccount.update({ last_sync_ads: new Date() })

    res.json({ message: 'Worker started' })
  } catch (error) {
    console.log(error.message)

    res.status(400).json({ error: error.message })
  }
}

const updateManyAd = async (req, res, next) => {
  const transaction = await database.transaction()
  const tokenFcm = pathOr([], ['body', 'tokenFcm'], req)
  const rows = pathOr([], ['body', 'rows'], req)
  const calcPriceId = pathOr([], ['body', 'calcPriceId'], req)
  const myList = []

  try {
    const calcPrice = await CalcPriceModel.findByPk(calcPriceId)

    const ajdustPriceString = pathOr('value => value', ['code'], calcPrice)
    const ajdustPrice = evalString(ajdustPriceString)

    await Promise.all(
      map(async ({ sku, price }) => {
        const ad = await MlAdModel.findOne({
          where: { sku: String(sku) },
          include: MlAccountAdModel
        })

        if (ad) {
          const newPrice = ajdustPrice(price)

          if (newPrice !== ad.price) {
            if (
              newPrice > multiply(ad.price, 20) ||
              newPrice < multiply(ad.price, 0.05)
            ) {
              console.log(
                'Há uma certa discrepância entre o novo preço e o antigo'
              )
              console.log(newPrice, ad.price, ad.sku, ad.title)
            } else {
              await Promise.all(
                map(async (mercado_libre_account_ad) => {
                  await mercado_libre_account_ad.update({
                    type_sync: false,
                    update_status: 'unupdated'
                  })

                  myList.push({
                    id: mercado_libre_account_ad.item_id,
                    price: newPrice,
                    accountId:
                      mercado_libre_account_ad.mercado_libre_account_id,
                    tokenFcm
                  })
                }, ad.mercado_libre_account_ads)
              )
              await ad.update({ price: newPrice })
            }
          } else {
            console.log('O preço se mantem igual')
          }
        }
      }, rows)
    )

    myList.forEach((payload) => {
      enqueue(payload)
    })

    await transaction.commit()
    res.json({ message: 'Worker started' })
  } catch (error) {
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
  updateAd,
  updateManyAd
}
