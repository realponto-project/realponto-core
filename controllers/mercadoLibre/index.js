const {
  pathOr,
  find,
  propEq,
  append,
  path,
  map,
  concat,
  splitEvery,
  forEach
} = require('ramda')

const database = require('../../database')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const mercadoLibreJs = require('../../services/mercadoLibre')
const tokenGenerate = require('../../utils/helpers/tokenGenerate')

const MlAccountModel = database.model('mercado_libre_account')
const MlAdModel = database.model('mercado_libre_ad')
const MlAccountAdModel = database.model('mercado_libre_account_ad')
const CalcPriceModel = database.model('calcPrice')

const {
  adsQueue,
  refreshTokenQueue,
  updateAdsOnDBQueue
} = require('../../services/queue/queues')
const enQueue = require('../../services/queue/queue')

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
      { repeat: { cron: '0 */4 * * *' }, jobId: accountMl.id }
      // { repeat: { cron: '0 0/5 * * *' } }
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
    // await refreshTokenQueue.empty()
    // await refreshTokenQueue.removeRepeatable({
    //   cron: '*/120 * * * *',
    //   jobId: 'acml_112e3a2a-2de4-455c-a156-ab1979ffc650'
    // })
    // response.forEach((element) => {
    //   refreshTokenQueue.add(
    //     { id: element.id }
    //     // { repeat: { cron: '0 */4 * * *' }, jobId: element.id }
    //   )

    //   console.log(element.id)
    // })
    // console.log(await refreshTokenQueue.getRepeatableJobs())
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

    // // console.log(query)
    // forEach(({ sku, price }) => {
    //   updateAdsOnDBQueue.add({
    //     sku,
    //     price,
    //     // price: price - 0.01,
    //     ajdustPriceString: 'value => value',
    //     tokenFcm: ''
    //   })
    // }, source)

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
      // data.results = []
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
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const tokenFcm = pathOr([], ['body', 'tokenFcm'], req)
  const rows = pathOr([], ['body', 'rows'], req)
  const calcPriceId = pathOr([], ['body', 'calcPriceId'], req)

  try {
    const calcPrice = await CalcPriceModel.findByPk(calcPriceId)

    const ajdustPriceString = pathOr('value => value', ['code'], calcPrice)

    forEach(({ sku, price }) => {
      updateAdsOnDBQueue.add({
        sku,
        price,
        ajdustPriceString,
        tokenFcm,
        companyId
      })
    }, rows)

    await transaction.commit()
    res.json({ message: 'Worker started' })
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const updateAdsByAccount = async (req, res, next) => {
  const mlAccountId = pathOr(null, ['params', 'mlAccountId'], req)

  try {
    console.log(mlAccountId)

    const accountAds = await MlAccountAdModel.findAll({
      where: {
        mercado_libre_account_id: mlAccountId
      },
      include: MlAdModel
      // limit: 2
    })

    await Promise.all(
      map(async (accountAd) => {
        await accountAd.update({
          type_sync: false,
          update_status: 'waiting_update'
        })
      }, accountAds)
    )

    forEach((accountAd) => {
      console.log(JSON.stringify(accountAd, null, 2))
      enQueue({
        sku: accountAd.mercado_libre_ad.sku,
        id: accountAd.item_id,
        price: accountAd.mercado_libre_ad.price,
        accountId: accountAd.mercado_libre_account_id,
        tokenFcm: ''
      })
    }, accountAds)

    res.json({ message: 'Worker started' })
  } catch (error) {
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
  updateManyAd,
  updateAdsByAccount
}
