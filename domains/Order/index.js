const { pathOr, isEmpty } = require('ramda')

const database = require('../../database')
const buildPagination = require('../../utils/helpers/searchSpec')

const CompanyModel = database.model('company')
const CustomerModel = database.model('customer')
const OrderModel = database.model('order')
const StatusModel = database.model('status')
const UserModel = database.model('user')

const buildSearchAndPagination = buildPagination('order')

class OrderDomain {
  async create(companyId, bodyData, options = {}) {
    const { transaction = null } = options

    const statusId = pathOr(null, ['statusId'], bodyData)
    const customerId = pathOr(null, ['customerId'], bodyData)
    const userId = pathOr(null, ['userId'], bodyData)

    const companyFinded = await CompanyModel.findByPk(companyId)

    if (!companyFinded) {
      throw new Error('company not found')
    }

    const statusFinded = await StatusModel.findOne({
      where: { id: statusId, companyId }
    })

    if (!statusFinded) {
      throw new Error('status not found or not belongs to company')
    }

    const customerFinded = await CustomerModel.findOne({
      where: { id: customerId, companyId }
    })

    if (customerId && !customerFinded) {
      throw new Error('customer not found or not belongs to company')
    }

    const userFinded = await UserModel.findOne({
      where: { id: userId, companyId }
    })

    if (userId && !userFinded) {
      throw new Error('user not found or not belongs to company')
    }
    return await OrderModel.create(
      {
        companyId,
        statusId,
        customerId,
        userId,
        pendingReview: statusFinded.fakeTransaction
      },
      { transaction }
    )
  }

  async getById(id, companyId, bodyData, options = {}) {
    return await OrderModel.findOne({
      where: { id, companyId },
      include: [StatusModel, CompanyModel, CustomerModel, UserModel]
    })
  }

  async getAll(query, companyId) {
    const { where, offset, limit } = buildSearchAndPagination({
      ...query,
      companyId
    })

    const orderWhere = isEmpty(where.orderWhere)
      ? { where: { companyId } }
      : { where: where.orderWhere }

    return await OrderModel.findAndCountAll({
      ...orderWhere,
      limit,
      offset,
      include: [StatusModel, CompanyModel, CustomerModel, UserModel]
    })
  }
}

module.exports = new OrderDomain()
