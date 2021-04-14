const buildPagination = require('../../utils/helpers/searchSpec')
const companySchema = require('../../utils/helpers/Schemas/company')
const database = require('../../database')

const CompanyModel = database.model('company')
const SubscriptionModel = database.model('subscription')
const PlanModel = database.model('plan')

const buildSearchAndPagination = buildPagination('company')

class CompanyDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    return await CompanyModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    await companySchema.validate(bodyData, { abortEarly: false })

    const searchCompany = await CompanyModel.findByPk(id)

    return await searchCompany.update(bodyData, { transaction })
  }

  async getById(id) {
    return await CompanyModel.findByPk(id, {
      include: [
        {
          model: SubscriptionModel,
          attributes: ['id', 'planId'],
          include: [{ model: PlanModel, attributes: ['quantityProduct'] }]
        }
      ]
    })
  }

  async getAll(query) {
    return await CompanyModel.findAndCountAll(
      buildSearchAndPagination({
        ...query
      })
    )
  }
}

module.exports = new CompanyDomain()
