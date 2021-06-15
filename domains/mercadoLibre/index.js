const sequelize = require('sequelize')
const {
  pathOr,
  findIndex,
  omit,
  pathEq,
  pipe,
  split,
  slice,
  join
} = require('ramda')

const database = require('../../database')
// const { NotFoundError } = require('../../utils/helpers/errors')
const buildPagination = require('../../utils/helpers/searchSpec')

const MlAccountModel = database.model('mercado_libre_account')
const MlAccountAdModel = database.model('mercado_libre_account_ad')
const MlAdModel = database.model('mercado_libre_ad')

class MercadoLibreDomain {
  async createOrUpdate(bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr(null, ['companyId'], bodyData)
    const sellerId = pathOr(null, ['sellerId'], bodyData)

    const account = await MlAccountModel.findOne({
      where: { companyId, sellerId },
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
      include: {
        model: MlAccountAdModel,
        where: buildPagination('mlAccountAd')(query).where
      },
      attributes: {
        include: [
          [
            sequelize.literal(`(
            	SELECT COUNT(*)
            	FROM mercado_libre_account_ad AS mercado_libre_account_ad
            		WHERE
            			mercado_libre_account_ad.mercado_libre_ad_id = mercado_libre_ad.id
            		)`),
            'totalAccountAd'
          ],
          [
            sequelize.literal(`(
            	SELECT COUNT(*)
            	FROM mercado_libre_account_ad AS mercado_libre_account_ad
            		WHERE
            			mercado_libre_account_ad.mercado_libre_ad_id = mercado_libre_ad.id
            			AND
            			mercado_libre_account_ad.type_sync = true
            		)`),
            'typeSyncTrue'
          ]
        ]
      },
      raw: true
    })

    return response
  }

  async createOrUpdateAd(payload, options = {}) {
    const { transaction = null } = options
    const sku = pathOr(null, ['sku', 'value_name'], payload)
    const company_id = pathOr('', ['companyId'], payload)

    let ad = await MlAdModel.findOne({
      where: { company_id, sku },
      include: MlAccountModel,
      transaction
    })

    if (ad) {
      const index = findIndex(
        // pathEq(['mercado_libre_account_ad', 'item_id'], payload.id),
        pathEq(['id'], payload.mlAccountId),
        ad.mercado_libre_accounts
      )
      if (index === -1) {
        await MlAccountAdModel.create(
          {
            item_id: payload.id,
            status: payload.status,
            mercado_libre_account_id: payload.mlAccountId,
            mercado_libre_ad_id: ad.id
          },
          { transaction }
        )
      }
    } else {
      ad = await MlAdModel.create(
        {
          ...omit(['id'], payload),
          sku,
          parse_sku: pipe(split('-'), slice(0, 2), join('-'))(sku)
        },
        { transaction }
      )
      await MlAccountAdModel.create(
        {
          item_id: payload.id,
          status: payload.status,
          mercado_libre_account_id: payload.mlAccountId,
          mercado_libre_ad_id: ad.id
        },
        { transaction }
      )
    }

    const count = await MlAdModel.count({
      where: { company_id, sku },
      transaction
    })

    if (count > 1) {
      throw new Error('More than one ad with same sku!')
    }

    return await MlAdModel.findByPk(ad.id, {
      include: MlAccountModel,
      raw: true,
      transaction
    })
  }

  async updateAd({ sku, price }, options = {}) {
    const { transaction } = options
    const adUpdated = await MlAccountModel.findOne({ where: { sku } })
    await adUpdated.update({ price }, { transaction })
    const response = await MlAccountAdModel.findOne({
      where: { mercadoLibre_account_id: adUpdated.id }
    })
    await response.update({ typeSync: false }, { transaction })
    return {
      id: response.itemId,
      price,
      accountId: response.mercadoLibre_account_id
    }
  }

  async getToken(mercadoLibre_account_id) {
    const response = await MlAccountModel.findByPk(mercadoLibre_account_id)
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
