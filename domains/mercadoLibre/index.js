const { pathOr, isEmpty, isNil } = require('ramda')

const database = require('../../database')
const { NotFoundError } = require('../../utils/helpers/errors')
const buildPagination = require('../../utils/helpers/searchSpec')

const MlAccountModel = database.model('mercadoLibre_account')

const buildSearchAndPagination = buildPagination('customer')

class MercadoLibreDomain {
  async create(bodyData) {
    const companyId = pathOr(null, ['companyId'], bodyData)
    const sellerId = pathOr(null, ['sellerId'], bodyData)
    
    let account = await MlAccountModel.findOne({ where: { companyId, sellerId }})
    
    if (!account) {
      account = await MlAccountModel.create(bodyData)
    }

    return account
  }

  async getAll(bodyData) {
    const companyId = pathOr(null, ['companyId'], bodyData)
    const response = await MlAccountModel.findAll({ where: { companyId }})

    return response
  }

  async getById(query) {
    const response = await MlAccountModel.findOne({ where: query })

    return response
  }
}

module.exports = new MercadoLibreDomain()
