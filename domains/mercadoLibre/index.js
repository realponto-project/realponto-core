const {
  pathOr,
  pipe,
  split,
  slice,
  join,
  applySpec,
  merge,
  ifElse,
  path,
  includes,
  equals,
  or,
  gt,
  multiply,
  lt,
  __
} = require('ramda')

const database = require('../../database')
const buildPagination = require('../../utils/helpers/searchSpec')

const LogErrorsModel = database.model('logError')
// const MercadolibreAdLogErrorsModel = database.model('mercadolibreAdLogErrors')
const MlAccountModel = database.model('mercadoLibreAccount')
const MlAdModel = database.model('mercadoLibreAd')

class MercadoLibreDomain {
  async createOrUpdate(bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr(null, ['companyId'], bodyData)
    const seller_id = pathOr(null, ['seller_id'], bodyData)

    const account = await MlAccountModel.findOne({
      where: { companyId, seller_id },
      transaction
    })

    if (account) {
      return await account.update(bodyData, { transaction })
    } else {
      return await MlAccountModel.create(bodyData, { transaction })
    }
  }

  async getAll(bodyData) {
    const companyId = pathOr(null, ['companyId'], bodyData)
    const response = await MlAccountModel.findAll({ where: { companyId } })

    return response
  }

  async getById(query) {
    const response = await MlAccountModel.findOne({ where: query })

    return response
  }

  async getAllAds(query) {
    const count = await MlAdModel.count({
      ...buildPagination('mlAd')(query)
    })

    const rows = await MlAdModel.findAll({
      ...buildPagination('mlAd')(query),
      include: LogErrorsModel
      // raw: true
    })

    return { count, rows }
  }

  async createOrUpdateAd(payload, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr('', ['companyId'], payload)

    let ad = await MlAdModel.findOne({
      where: { companyId, item_id: payload.id },
      include: LogErrorsModel,
      // include: MlAccountModel,
      transaction
    })

    if (ad) {
      const buildAd = applySpec({
        sku: pathOr(null, ['sku', 'value_name']),
        parse_sku: pipe(
          pathOr(null, ['sku', 'value_name']),
          pipe(split('-'), slice(0, 2), join('-'))
        ),
        title: pathOr(null, ['title']),
        item_id: pathOr(null, ['id']),
        status: pathOr(null, ['status']),
        price_ml: pathOr(null, ['price']),
        mercadoLibreAccountId: pathOr(null, ['mlAccountId']),
        companyId: pathOr(null, ['companyId'])
      })

      const adBuilded = buildAd(payload)

      const adPUpdatePayload = merge(
        adBuilded,
        ifElse(
          pipe(
            path(['update_status']),
            includes(__, ['unupdated', 'updated', 'not_update'])
          ),
          ifElse(
            (values) => equals(values.price_ml, values.price),
            () => ({ update_status: 'updated' }),
            ifElse(
              ({ price_ml, price }) =>
                or(
                  gt(price, multiply(price_ml, 2)),
                  lt(price, multiply(price_ml, 0.7))
                ),
              () => ({ update_status: 'not_update' }),
              () => ({ update_status: 'unupdated' })
            )
          ),
          () => ({})
        )({
          update_status: path(['update_status'], ad),
          price_ml: path(['price_ml'], adBuilded),
          price: path(['price'], ad)
        })
      )

      await ad.update(adPUpdatePayload, { transaction })
    } else {
      const buildAd = applySpec({
        sku: pathOr(null, ['sku', 'value_name']),
        parse_sku: pipe(
          pathOr(null, ['sku', 'value_name']),
          pipe(split('-'), slice(0, 2), join('-'))
        ),
        title: pathOr(null, ['title']),
        item_id: pathOr(null, ['id']),
        status: pathOr(null, ['status']),
        price: pathOr(null, ['price']),
        price_ml: pathOr(null, ['price']),
        mercadoLibreAccountId: pathOr(null, ['mlAccountId']),
        companyId: pathOr(null, ['companyId'])
      })

      ad = await MlAdModel.create(buildAd(payload), { transaction })
    }

    return await MlAdModel.findByPk(ad.id, {
      include: MlAccountModel,
      raw: true,
      transaction
    })
  }

  async updateAd({ sku, price }, options = {}) {
    // const { transaction } = options
    // const adUpdated = await MlAccountModel.findOne({ where: { sku } })
    // await adUpdated.update({ price }, { transaction })
    // const response = await MlAccountAdModel.findOne({
    //   where: { mercadoLibre_account_id: adUpdated.id }
    // })
    // await response.update({ typeSync: false }, { transaction })
    // return {
    //   id: response.itemId,
    //   price,
    //   accountId: response.mercadoLibre_account_id
    // }
  }

  async getToken(mercadoLibreAccountId) {
    const response = await MlAccountModel.findByPk(mercadoLibreAccountId)
    return response && response.access_token
  }

  async getRefreshToken(mercadoLibre_account_id) {
    const response = await MlAccountModel.findByPk(mercadoLibre_account_id)
    return response && response.refresh_token
  }

  async setNewToken(mercadoLibre_account_id, payload) {
    const refresh_token = pathOr(null, ['refresh_token'], payload)
    const access_token = pathOr(null, ['access_token'], payload)

    const mercadoLibreAccount = await MlAccountModel.findByPk(
      mercadoLibre_account_id
    )

    const response = await mercadoLibreAccount.update({
      refresh_token,
      access_token
    })
    return response
  }
}

module.exports = new MercadoLibreDomain()
