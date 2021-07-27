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
  __,
  prop,
  keys,
  filter,
  mergeAll,
  map,
  always,
  has,
  propOr
} = require('ramda')

const database = require('../../database')
const buildPagination = require('../../utils/helpers/searchSpec')
const mercadoLibreJs = require('../../services/mercadoLibre')

const LogErrorsModel = database.model('logError')
const MercadolibreAdLogErrorsModel = database.model('mercadolibreAdLogErrors')
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
    const changePrice = propOr({ origin: 'alxa' }, options)

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
            includes(__, [
              'unupdated',
              'unupdated_alxa',
              'updated',
              'not_update'
            ])
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
              () => ({
                update_status: 'unupdated_alxa'
              })
            )
          ),
          () => ({})
        )({
          update_status: path(['update_status'], ad),
          price_ml: path(['price_ml'], adBuilded),
          price: path(['price'], ad)
        })
      )

      await ad.update(adPUpdatePayload, {
        transaction,
        changePrice
      })
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

      ad = await MlAdModel.create(buildAd(payload), {
        transaction,
        changePrice
      })
    }

    return await MlAdModel.findByPk(ad.id, {
      include: MlAccountModel,
      raw: true,
      transaction
    })
  }

  async updateAd(id, bodyData, options = {}) {
    const { transaction = null } = options
    const adUpdated = await MlAdModel.findByPk(id)

    if (!adUpdated) throw new Error('Ad not found')

    const isActive = has('active', adUpdated)

    if (isActive) {
      const checkPropChange = (property) =>
        pipe(
          prop(property),
          ifElse(
            equals(prop(property, adUpdated)),
            () => {},
            (value) => value
          )
        )

      const buildUpdateAd = pipe(
        applySpec({
          accountId: always(prop('mercadoLibreAccountId', adUpdated)),
          id: always(prop('item_id', adUpdated)),
          sku: checkPropChange('sku'),
          title: checkPropChange('title'),
          price: checkPropChange('price'),
          price_ml: checkPropChange('price')
        }),
        (values) =>
          pipe(
            keys,
            filter((key) => values[key]),
            map((key) => ({ [key]: values[key] })),
            mergeAll
          )(values)
      )

      const payloadUpdateAd = buildUpdateAd(bodyData)

      await mercadoLibreJs.ads.update(payloadUpdateAd)

      if (has('price', payloadUpdateAd)) {
        await MercadolibreAdLogErrorsModel.destroy({
          where: { mercadoLibreAdId: adUpdated.id },
          force: true,
          transaction
        })
      }

      const update_status = ifElse(
        has('price'),
        always('updated'),
        always(prop('update_status', adUpdated))
      )(payloadUpdateAd)

      await adUpdated.update(
        { ...payloadUpdateAd, update_status },
        { transaction, changePrice: { origin: 'alxa' } }
      )
    }
  }

  async syncPrice(id, sync, options = {}) {
    const { transaction = null } = options
    const adUpdated = await MlAdModel.findByPk(id)

    if (!adUpdated) throw new Error('Ad not found')

    if (sync === 'price_ml') {
      const buildUpdateAd = applySpec({
        accountId: prop('mercadoLibreAccountId'),
        id: prop('item_id'),
        price: prop('price')
      })

      const payloadUpdateAd = buildUpdateAd(adUpdated)

      await mercadoLibreJs.ads.update(payloadUpdateAd)

      await adUpdated.update(
        { price_ml: adUpdated.price, update_status: 'updated' },
        { transaction }
      )
    }
    if (sync === 'price') {
      await adUpdated.update(
        { price: adUpdated.price_ml, update_status: 'updated' },
        { transaction }
      )
    }

    await MercadolibreAdLogErrorsModel.destroy({
      where: { mercadoLibreAdId: adUpdated.id },
      force: true,
      transaction
    })
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

  async updateActive(id, bodyData, options = {}) {
    const { transaction = null } = options
    const active = pathOr(null, ['active'], bodyData)

    const adUpdated = await MlAdModel.findByPk(id)

    return await adUpdated.update(active, { transaction })
  }
}

module.exports = new MercadoLibreDomain()
