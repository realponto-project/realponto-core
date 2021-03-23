const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const PlanModel = database.model('plan')
const planSchema = require('../../utils/helpers/Schemas/Plan')

const buildSearchAndPagination = buildPagination('status')

class StatusDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    await planSchema.validate(bodyData, { abortEarly: false })
    return await PlanModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    await planSchema.validate(bodyData, { abortEarly: false })

    const searchStatus = await PlanModel.findByPk(id)

    return await searchStatus.update(bodyData, { transaction })
  }

  async getById(id) {
    return await PlanModel.findOne({ where: { id } })
  }

  async getAll(query) {
    return await PlanModel.findAndCountAll(buildSearchAndPagination(query))
  }
}

module.exports = new StatusDomain()
