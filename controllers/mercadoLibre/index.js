const {
  pathOr,
  find,
  pathEq,
  propEq,
  append,
  path,
  slice,
  concat,
  inc,
  omit
} = require('ramda')

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
  console.log(req.decoded)

  const mlAccount = find(
    propEq('id', mlAccountId),
    pathOr([], ['decoded', 'sellersMercadoLibre'], req)
  )

  console.log(pathOr([], ['decoded', 'sellersMercadoLibre'], req))
  console.log(mlAccountId)

  const accessToken = pathOr('', ['access_token'], mlAccount)
  console.log(accessToken)

  try {
    const userDataMl = await mercadoLibreJs.user.myInfo(accessToken)
    const seller_id = path(['data', 'id'], userDataMl)
    // // lorival seller=id= 188010504
    const firstGet = await mercadoLibreJs.ads.get(accessToken, seller_id)

    console.log(firstGet)

    let data = firstGet.data
    let results = pathOr([], ['data', 'results'], firstGet)
    let count = 0
    let countWithSKU = 0
    let countWithoutSKU = 0

    while (data.results.length > 0) {
      for (let index = 0; index < data.results.length / 20; index++) {
        const response = await mercadoLibreJs.item.multiget(
          accessToken,
          slice(20 * index, 20 * (index + 1), data.results),
          [
            'id',
            'title',
            'price',
            'status',
            'seller_custom_field',
            'attributes'
          ]
        )

        response.data.forEach(async ({ code, body }) => {
          if (code === 200) {
            const attributes = pathOr([], ['attributes'], body)
            const sku = find(propEq('id', 'SELLER_SKU'), attributes)
            // console.log(sku)
            if (sku) {
              countWithSKU = inc(countWithSKU)
              const respDomain = await MercadoLibreDomain.createOrUpdateAd({
                ...omit(['attributes'], body),
                companyId,
                mlAccountId,
                sku
              })

              // console.log(respDomain)
            } else {
              countWithoutSKU = inc(countWithoutSKU)
            }
          }
        })
      }

      const resp = await mercadoLibreJs.ads.get(
        accessToken,
        seller_id,
        data.scroll_id
      )

      // data.results = []
      results = concat(results, resp.data.results)
      data = resp.data
      count = inc(count)
      console.log(count)
    }

    // console.log(results)
    // console.log(results.length)
    // console.log(data.paging)
    // console.log(data.results)
    // console.log(data.results.length)

    console.log(countWithSKU)
    console.log(countWithoutSKU)

    // const response = await MercadoLibreDomain.getAllAds({ companyId })
    // res.json(response)
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createAccount,
  getAllAccounts,
  getAccount,
  getAllAds,
  loadAds
}
