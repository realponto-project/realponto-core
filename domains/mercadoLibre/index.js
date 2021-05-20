const sequelize = require('sequelize')
const {
  pathOr,
  findIndex,
  propEq
  // isEmpty, isNil
} = require('ramda')

const database = require('../../database')
// const { NotFoundError } = require('../../utils/helpers/errors')
const buildPagination = require('../../utils/helpers/searchSpec')

const MlAccountModel = database.model('mercadoLibreAccount')
const MlAccountAdModel = database.model('mercadoLibreAccountAd')
const MlAdModel = database.model('mercadoLibreAd')

class MercadoLibreDomain {
  async createOrUpdate(bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr(null, ['companyId'], bodyData)
    const sellerId = pathOr(null, ['sellerId'], bodyData)

    console.log('>', bodyData)

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
    const count = await MlAccountAdModel.count({
      where: buildPagination('mlAccountAd')(query).where,
      include: {
        model: MlAdModel,
        where: buildPagination('mlAccount')(query).where
      }
    })

    const rows = await MlAdModel.findAll({
      // ...buildPagination('mlAccount')(query),
      // include: {
      //   model: MlAccountAdModel,
      //   where: buildPagination('mlAccountAd')(query).where
      // },
      attributes: {
        include: [
          [
            sequelize.literal(`(
							SELECT COUNT(*)
							FROM mercadoLibreAccountAd AS mercadoLibreAccountAd
					)`),
            'laughReactionsCount'
          ]
          //     [
          //       sequelize.fn(
          //         'count',
          //         "IF('mercadoLibreAccountAd'.'typeSync' = 1, 5, NULL)"
          //         // sequelize.fn(
          //         //   'where',
          //         // sequelize.col('mercadoLibreAccountAds.typeSync')
          //         // )
          //       ),
          //       'count'
          //     ]
        ]
      }
      // group: [
      //   'mercadoLibreAccountAds.id',
      //   'mercadoLibreAccountAds.itemId',
      //   'mercadoLibreAd.id'
      // ]
      // raw: true
    })

    console.log({ count })
    console.log(JSON.stringify(rows, null, 2))
    return { count }
  }

  async createOrUpdateAd(payload) {
    // console.log(payload)
    const sku = pathOr(null, ['sku', 'value_name'], payload)
    const companyId = pathOr('', ['companyId'], payload)

    let ad = await MlAdModel.findOne({
      where: { companyId, sku },
      include: MlAccountModel
    })

    if (ad) {
      const index = findIndex(
        propEq('id', payload.mlAccountId),
        ad.mercadoLibreAccounts
      )
      if (index === -1) {
        await MlAccountAdModel.create({
          itemId: payload.id,
          status: payload.status,
          mercadoLibreAccountId: payload.mlAccountId,
          mercadoLibreAdId: ad.id
        })
      }
    } else {
      ad = await MlAdModel.create({ ...payload, sku })
      await MlAccountAdModel.create({
        itemId: payload.id,
        status: payload.status,
        mercadoLibreAccountId: payload.mlAccountId,
        mercadoLibreAdId: ad.id
      })
    }

    return await MlAdModel.findByPk(ad.id, {
      include: MlAccountModel,
      raw: true
    })
  }
}

module.exports = new MercadoLibreDomain()
