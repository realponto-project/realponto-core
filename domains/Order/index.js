const { pathOr, isEmpty, map, add, subtract, applySpec, pipe } = require('ramda')

const database = require('../../database')
const buildPagination = require('../../utils/helpers/searchSpec')
const OrderSchema = require('../../utils/helpers/Schemas/Order')
const { omit } = require('../../utils/helpers/Schemas/company')

const CompanyModel = database.model('company')
const CustomerModel = database.model('customer')
const OrderModel = database.model('order')
const StatusModel = database.model('status')
const UserModel = database.model('user')
const TransactionModel = database.model('transaction')
const ProductModel = database.model('product')
const AddressModel = database.model('address')

const buildSearchAndPagination = buildPagination('order')
class OrderDomain {
  async create(payload, options = {}) {
    const { transaction = null } = options
    const originType = pathOr('pdv', ['originType'], payload)
    const companyId = pathOr(null, ['companyId'], payload)
    const userId = pathOr(null, ['userId'], payload)
    const customer = pathOr({}, ['customers'], payload)
    let customerCreated = {}
    if(!isEmpty(customer)) {
      const findCustomer = await CustomerModel.findOne({ where: { document: customer.document }})
      if (findCustomer) {
        customerCreated = findCustomer
      } else {
        const address = await AddressMode.create(omit(['document', 'name'], customer), { transaction })
        customerCreated = await CustomerModel.create({
          ...customer,
          companyId,
          addressId: address.id,
        }, { transaction })
      }
    }

    const buildOrder = applySpec({
      payment: pathOr('cash', ['paymentMethod']),
      originType:  pathOr('pdv', ['originType']),
      installments: pathOr(0, ['installments']),
      companyId: pathOr(0, ['companyId']),
    })(payload)

    let defaultStatus = {
      id: pathOr(null, ['statusId'], payload)
    }

    if (originType === 'pdv') {
      defaultStatus = await StatusModel.findOne({ where: { companyId, value : 'sale' }})
      buildOrder.userId = userId
    }
      
    const statusFinded = await StatusModel.findOne({
      where: { id: defaultStatus.id, companyId }
    })

    const orderCreated = await OrderModel.create(
      {
        ... buildOrder,
        statusId: defaultStatus.id,
        customerId: pathOr(null, ['id'], customerCreated)
      },
      { transaction }
    )

    const products = pathOr([], ['products'], payload)
    const formatProducts = (product) => ({
      productId: product.id,
      quantity: product.quantity,
      orderId: orderCreated.id,
      userId,
      statusId: defaultStatus.id,
      companyId,
      price: product.salePrice
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

      await product.update({ balance }, { transaction })
    })

    await Promise.all(updateBalances)

    return await OrderModel.findByPk(orderCreated.id, {
      include: [{
        model: TransactionModel, include: [ProductModel]
      },
      {
        model: CustomerModel, include: [AddressModel]
      }
    ],
      transaction
    })
  }

  // async create(bodyData, options = {}) {
  //   const { transaction = null } = options
  //   const companyId = pathOr(null, ['companyId'], bodyData)

  //   const statusId = pathOr(null, ['statusId'], bodyData)
  //   const customerId = pathOr(null, ['customerId'], bodyData)
  //   const userId = pathOr(null, ['userId'], bodyData)

  //   const companyFinded = await CompanyModel.findByPk(companyId)

  //   await OrderSchema.validate(bodyData)

  //   if (!companyFinded) {
  //     throw new Error('company not found')
  //   }

 

  //   if (!statusFinded) {
  //     throw new Error('status not found or not belongs to company')
  //   }

  //   const customerFinded = await CustomerModel.findOne({
  //     where: { id: customerId, companyId }
  //   })

  //   if (customerId && !customerFinded) {
  //     throw new Error('customer not found or not belongs to company')
  //   }

  //   const userFinded = await UserModel.findOne({
  //     where: { id: userId, companyId }
  //   })

  //   if (userId && !userFinded) {
  //     throw new Error('user not found or not belongs to company')
  //   }
  //   const orderCreated = await OrderModel.create(
  //     {
  //       companyId,
  //       statusId,
  //       customerId,
  //       userId,
  //       pendingReview: statusFinded.fakeTransaction
  //     },
  //     { transaction }
  //   )

  
  // }

  // async getById(id, companyId, options = {}) {
  //   return await OrderModel.findOne({
  //     where: { id, companyId },
  //     include: [StatusModel, CustomerModel, UserModel, TransactionModel]
  //   })
  // }

  async getAll(query, companyId) {
    const { where, offset, limit } = buildSearchAndPagination({
      ...query,
      companyId
    })

    const orderWhere = isEmpty(where.orderWhere)
      ? { where: { companyId } }
      : { where: where.orderWhere }

    const count = await OrderModel.count({ ...orderWhere })

    const rows = await OrderModel.findAll({
      ...orderWhere,
      limit,
      offset,
      include: [StatusModel, CustomerModel, UserModel, TransactionModel]
    })

    return { count, rows }
  }
}

module.exports = new OrderDomain()
