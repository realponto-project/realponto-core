const { pathOr, isEmpty, map, add, subtract } = require('ramda')

const database = require('../../database')
const buildPagination = require('../../utils/helpers/searchSpec')
const OrderSchema = require('../../utils/helpers/Schemas/Order')

const CompanyModel = database.model('company')
const CustomerModel = database.model('customer')
const OrderModel = database.model('order')
const StatusModel = database.model('status')
const UserModel = database.model('user')
const TransactionModel = database.model('transaction')
const ProductModel = database.model('product')

const buildSearchAndPagination = buildPagination('order')

class OrderDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    const companyId = pathOr(null, ['companyId'], bodyData)
    const statusId = pathOr(null, ['statusId'], bodyData)
    const customerId = pathOr(null, ['customerId'], bodyData)
    const userId = pathOr(null, ['userId'], bodyData)

    const companyFinded = await CompanyModel.findByPk(companyId)

    await OrderSchema.validate(bodyData)

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
    const orderCreated = await OrderModel.create(
      {
        companyId,
        statusId,
        customerId,
        userId,
        pendingReview: statusFinded.fakeTransaction
      },
      { transaction }
    )

    const { products } = bodyData

    const formatProducts = (product) => ({
      ...product,
      orderId: orderCreated.id,
      userId,
      statusId,
      companyId
    })

    const productsPayload = map(formatProducts, products)

    const transactions = await TransactionModel.bulkCreate(productsPayload, {
      transaction
    })

    const updateBalances = transactions.map(async ({ productId, quantity }) => {
      const product = await ProductModel.findByPk(productId, { transaction })

      const balanceOBJ = {
        inputs: add(product.balance, quantity),
        outputs: subtract(product.balance, quantity)
      }

      const balance = balanceOBJ[statusFinded.type]

      // const balance = {
      //   inputs: add(product.balance, quantity),
      //   outputs: subtract(product.balance, quantity)
      // }[statusFinded.type]

      await product.update({ balance }, { transaction })
    })

    await Promise.all(updateBalances)

    return await OrderModel.findByPk(orderCreated.id, {
      include: [TransactionModel]
    })
  }

  async getById(id, companyId, bodyData, options = {}) {
    return await OrderModel.findOne({
      where: { id, companyId },
      include: [
        StatusModel,
        CompanyModel,
        CustomerModel,
        UserModel,
        TransactionModel
      ]
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
      include: [
        StatusModel,
        CompanyModel,
        CustomerModel,
        UserModel,
        TransactionModel
      ]
    })
  }
}

module.exports = new OrderDomain()
