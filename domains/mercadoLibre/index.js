const { pathOr, pipe, split, slice, join, applySpec } = require('ramda')

const database = require('../../database')
const buildPagination = require('../../utils/helpers/searchSpec')

const LogErrorsModel = database.model('logErrors')
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
    const response = await MlAdModel.findAndCountAll({
      ...buildPagination('mlAd')(query),
      include: LogErrorsModel
      // raw: true
    })

    return response
  }

  async createOrUpdateAd(payload, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr('', ['companyId'], payload)

    let ad = await MlAdModel.findOne({
      where: { companyId, item_id: payload.id },
      include: MlAccountModel,
      transaction
    })
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
      mercadoLibreAccountId: pathOr(null, ['mlAccountId']),
      companyId: pathOr(null, ['companyId'])
    })

    if (ad) {
      await ad.update(buildAd(payload), { transaction })
    } else {
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
