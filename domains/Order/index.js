const {
  pathOr,
  isEmpty,
  map,
  add,
  subtract,
  applySpec,
  omit,
  path
} = require('ramda')

const database = require('../../database')
const buildPagination = require('../../utils/helpers/searchSpec')

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
    const customer = pathOr({}, ['customer'], payload)
    let customerCreated = {}

    if (!isEmpty(customer)) {
      const findCustomer = await CustomerModel.findOne({
        where: { document: customer.document }
      })
      if (findCustomer) {
        customerCreated = findCustomer
      } else {
        const address = await AddressModel.create(
          omit(['document', 'name'], customer),
          { transaction }
        )
        customerCreated = await CustomerModel.create(
          {
            ...customer,
            companyId,
            addressId: address.id
          },
          { transaction }
        )
      }
    }

    const buildOrder = applySpec({
      payment: pathOr('cash', ['paymentMethod']),
      orderDate: path(['orderDate']),
      originType: pathOr('pdv', ['originType']),
      installments: pathOr(0, ['installments']),
      customerId: pathOr(null, ['customerId']),
      userId: pathOr(null, ['userId']),
      companyId: pathOr(0, ['companyId'])
    })(payload)

    let defaultStatus = {
      id: pathOr(null, ['statusId'], payload)
    }

    if (originType === 'pdv') {
      defaultStatus = await StatusModel.findOne({
        where: { companyId, value: 'sale' }
      })
      buildOrder.userId = userId
      buildOrder.customerId = pathOr(null, ['id'], customerCreated)
    }

    const statusFinded = await StatusModel.findOne({
      where: { id: defaultStatus.id, companyId }
    })

    const orderCreated = await OrderModel.create(
      {
        ...buildOrder,
        statusId: defaultStatus.id
      },
      { transaction }
    )

    const products = pathOr([], ['products'], payload)
    const formatProducts = (product) => ({
      productId: product.productId,
      quantity: product.quantity,
      orderId: orderCreated.id,
      userId,
      statusId: defaultStatus.id,
      companyId,
      price: product.price
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
      include: [
        {
          model: TransactionModel,
          include: [ProductModel]
        },
        {
          model: CustomerModel,
          include: [AddressModel]
        }
      ],
      transaction
    })
  }

  async getById(id, companyId, options = {}) {
    return await OrderModel.findOne({
      where: { id, companyId },
      include: [
        { model: StatusModel },
        { model: CustomerModel, include: [AddressModel] },
        { model: UserModel },
        { model: TransactionModel, include: [ProductModel] }
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

    const count = await OrderModel.count({ ...orderWhere })

    const rows = await OrderModel.findAll({
      ...orderWhere,
      limit,
      offset,
      include: [
        { model: StatusModel },
        { model: CustomerModel, include: [AddressModel] },
        {
          model: UserModel,
          where: where.user || undefined
        },
        { model: TransactionModel, include: [ProductModel] }
      ]
    })

    return { count, rows }
  }
}

module.exports = new OrderDomain()
