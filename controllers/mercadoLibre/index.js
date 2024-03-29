const sequelize = require('sequelize')
const {
  pathOr,
  find,
  propEq,
  append,
  map,
  concat,
  splitEvery,
  forEach,
  applySpec,
  length,
  addIndex,
  pipe,
  prop,
  keys,
  filter,
  __,
  not,
  assoc,
  mergeAll,
  equals
} = require('ramda')

const database = require('../../database')
const MercadoLibreDomain = require('../../domains/mercadoLibre')
const mercadoLibreJs = require('../../services/mercadoLibre')
const tokenGenerate = require('../../utils/helpers/tokenGenerate')

const MercadolibreAdLogErrorsModel = database.model('mercadolibreAdLogErrors')
const MlAdModel = database.model('mercadoLibreAd')
const CalcPriceModel = database.model('calcPrice')

const {
  adsQueue,
  refreshTokenQueue,
  updateAdsOnDBQueue
} = require('../../services/queue/queues')
const enQueue = require('../../services/queue/queue')

const { Op } = sequelize

const createAccount = async (req, res, next) => {
  const transaction = await database.transaction()
  const code = pathOr({}, ['body', 'code'], req)
  const tokenFcm = pathOr(null, ['body', 'tokenFcm'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const user = pathOr(null, ['decoded', 'user'], req)
  const sellersMercadoLibre = pathOr(
    [],
    ['decoded', 'sellersMercadoLibre'],
    req
  )

  try {
    const autorizationMl = await mercadoLibreJs.authorization.token(code)

    const { access_token, refresh_token, user_id } = applySpec({
      access_token: pathOr(null, ['data', 'access_token']),
      refresh_token: pathOr(null, ['data', 'refresh_token']),
      user_id: pathOr(null, ['data', 'user_id'])
    })(autorizationMl)

    const userDataMl = await mercadoLibreJs.user.myInfo(access_token)

    const { first_name, last_name, seller_id } = applySpec({
      first_name: pathOr(null, ['data', 'first_name']),
      last_name: pathOr(null, ['data', 'last_name']),
      seller_id: pathOr(null, ['data', 'id'])
    })(userDataMl)

    const accountMl = await MercadoLibreDomain.createOrUpdate(
      {
        fullname: `${first_name} ${last_name}`,
        seller_id,
        access_token,
        refresh_token,
        companyId
      },
      { transaction }
    )

    const findUserId = find(propEq('user_id', user_id))

    const parserSellers = findUserId(sellersMercadoLibre)
      ? sellersMercadoLibre
      : append(pathOr([], ['data'], autorizationMl), sellersMercadoLibre)

    refreshTokenQueue.add(
      { id: accountMl.id },
      { repeat: { cron: '0 */4 * * *' }, jobId: accountMl.id }
    )

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

    listSplited.forEach((list, index) => {
      adsQueue.add({
        list,
        access_token,
        companyId,
        mlAccountId: accountMl.id,
        tokenFcm,
        index,
        total: length(listSplited) - 1
      })
    })

    await accountMl.update({ last_sync_ads: new Date() }, { transaction })

    transaction.commit()
    res.status(201).json({
      token: tokenGenerate({ user, sellersMercadoLibre: parserSellers }),
      accountMl
    })
		res.status(201)
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

  const mercadoLibreAdId = pathOr('', ['params', 'id'], req)
  const bodyData = pathOr('', ['body'], req)

  try {
    const response = await MercadoLibreDomain.updateAd(
      mercadoLibreAdId,
      bodyData,
      { transaction }
    )
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()

    res.status(400).json({
      error: error.message,
      data: pathOr({}, ['response', 'data'], error)
    })
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

    addIndex(forEach)(({ sku, price }, index) => {
      updateAdsOnDBQueue.add({
        sku,
        price,
        ajdustPriceString,
        tokenFcm,
        companyId,
        index,
        total: length(rows) - 1
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
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const tokenFcm = pathOr('', ['body', 'tokenFcm'], req)
  const query = pipe(
    applySpec({
      update_status: pathOr('', ['update_status']),
      status: pathOr('', ['status']),
      sku: (values) => ({
        [Op.startsWith]: pathOr('', ['searchGlobal'], values)
      })
    }),
    (values) =>
      pipe(
        keys,
        filter(pipe(prop(__, values), equals(''), not)),
        map((key) => assoc(key, prop(key, values), {})),
        mergeAll
      )(values)
  )(pathOr({}, ['body', 'query'], req))

  try {
    const ads = await MlAdModel.findAll({
      where: {
        [Op.and]: [
          {
            ...query,
            companyId,
            mercadoLibreAccountId: mlAccountId
          },
          {
            update_status: { [Op.ne]: 'not_update' }
          },
          {
            update_status: { [Op.ne]: 'waiting_update' }
          },
          {
            update_status: { [Op.ne]: 'updated' }
          }
        ]
      }
    })

    await Promise.all(
      map(async (ad) => {
        await MercadolibreAdLogErrorsModel.destroy({
          where: { mercadoLibreAdId: ad.id },
          force: true
        })
        await ad.update({
          update_status: 'waiting_update'
        })
      }, ads)
    )
    addIndex(forEach)((ad, index) => {
      enQueue({
        mercadoLibreAdId: ad.id,
        sku: ad.sku,
        id: ad.item_id,
        price: ad.price,
        accountId: ad.mercadoLibreAccountId,
        tokenFcm,
        index,
        total: length(ads) - 1
      })
    }, ads)
    res.json({ message: 'Worker started' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const syncPrice = async (req, res, next) => {
  const transaction = await database.transaction()

  const adId = pathOr(null, ['params', 'id'], req)
  const sync = pathOr({}, ['body', 'sync'], req)

  try {
    await MercadoLibreDomain.syncPrice(adId, sync, {
      transaction
    })
    await transaction.commit()
    res.json()
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const updateActive = async (req, res, next) => {
  const transaction = await database.transaction()

  const mercadoLibreAdId = pathOr('', ['params', 'id'], req)

  try {
    const response = await MercadoLibreDomain.updateActive(mercadoLibreAdId, {
      transaction
    })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()

    res.status(400).json({
      error: error.message,
      data: pathOr({}, ['response', 'data'], error)
    })
  }
}

module.exports = {
  createAccount,
  getAllAccounts,
  getAccount,
  getAllAds,
  updateAd,
  updateManyAd,
  updateAdsByAccount,
  syncPrice,
  updateActive
}
