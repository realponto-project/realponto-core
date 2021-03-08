const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const StatusModel = database.model('status')
const statusSchema = require('../../utils/helpers/Schemas/status')

const buildSearchAndPagination = buildPagination('status')

class StatusDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    await statusSchema.validate(bodyData, { abortEarly: false })

    return await StatusModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    await statusSchema.validate(bodyData, { abortEarly: false })

    const searchStatus = await StatusModel.findByPk(id)

    return await searchStatus.update(bodyData, { transaction })
  }

  async getById(id, companyId) {
    return await StatusModel.findOne({ where: { companyId, id } })
  }

  async getAll(query, companyId) {
    return await StatusModel.findAndCountAll(
      buildSearchAndPagination({
        ...query,
        companyId
      })
    )
  }
}

module.exports = new StatusDomain()
