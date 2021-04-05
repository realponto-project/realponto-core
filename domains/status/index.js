const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const StatusModel = database.model('status')
const statusSchema = require('../../utils/helpers/Schemas/status')
const { NotFoundError } = require('../../utils/helpers/errors')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op
const { pathOr } = require('ramda')

const buildSearchAndPagination = buildPagination('status')

class StatusDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr(null, ['companyId'], bodyData)
    await statusSchema.validate(bodyData, { abortEarly: false })

    const findStatus = await StatusModel.findOne({
      where: { label: { [iLike]: `%${bodyData.label}%` }, companyId }
    })

    if (findStatus) {
      return findStatus
    }

    return await StatusModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr(null, ['companyId'], bodyData)

    await statusSchema.validate(bodyData, { abortEarly: false })

    const searchStatus = await StatusModel.findByPk(id)

    const findStatus = await StatusModel.findOne({
      where: { label: { [iLike]: `%${bodyData.label}%` }, companyId }
    })

    if (findStatus && findStatus.label !== bodyData.label) {
      throw new NotFoundError('status with same label')
    }

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
