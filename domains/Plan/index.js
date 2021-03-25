const database = require('../../database')
const PlanModel = database.model('plan')
const buildPagination = require('../../utils/helpers/searchSpec')
const planSchema = require('../../utils/helpers/Schemas/Plan')

const buildSearchAndPagination = buildPagination('plan')

class PlanDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    await planSchema.validate(bodyData, { abortEarly: false })
    return PlanModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    await planSchema.validate(bodyData, { abortEarly: false })

    const searchStatus = await PlanModel.findByPk(id)

    return searchStatus.update(bodyData, { transaction })
  }

  async getAll(query) {
    return PlanModel.findAndCountAll(buildSearchAndPagination(query))
  }
}

module.exports = new PlanDomain()
