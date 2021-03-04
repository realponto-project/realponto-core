const {
  pathOr,
  map,
  omit,
  propEq,
  isEmpty,
} = require('ramda')
const database = require('../../database')
const OrderModel = database.model('order')
const TransactionModel = database.model('transaction')
const ProductModel = database.model('product')
const UserModel = database.model('user')
const SerialNumberModel = database.model('serialNumber')
const BalanceModel = database.model('balance')
const StatusModel = database.model('status')
const OrderProductModel = database.model('orderProduct')
const CustomerModel = database.model('customer')
const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('order')
const Sequelize = require('sequelize')
const { parserSummaryData, getStatusSummary } = require('../../utils/helpers/summaryDataParser')

const includeValues = [
  {
    model: CustomerModel,
    attributes: ['name', 'document']
  },
  {
    model: UserModel,
    attributes: ['name', 'activated']
  },
  {
    model: StatusModel,
    attributes: [ 'value', 'color', 'typeLabel']
  },
  {
    model: TransactionModel,
    attributes: ['quantity', 'id'],
    include: [
      {
        model: ProductModel,
        attributes: ['name', 'activated'],
      },
      {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel', 'type']
      },
      {
        model: UserModel,
        attributes: ['name', 'activated']
      }
    ],
  },
]

const include = [
  {
    model: UserModel,
    attributes: ['name', 'activated']
  },
  {
    model: CustomerModel,
    attributes: ['name', 'document', 'phone']
  },
  {
    model: StatusModel,
    attributes: [ 'value', 'color', 'typeLabel', 'type']
  },
  {
    model: SerialNumberModel,
    attributes: ['id', 'serialNumber', 'activated', 'transactionInId', 'transactionOutId'],
    include: [
      {
        model: ProductModel,
        attributes: ['id', 'name', 'activated'],
      },
      {
        model: UserModel,
        attributes: ['id', 'name', 'activated']
      },
    ]
  },
  {
    model: TransactionModel,
    attributes: ['quantity', 'id', 'productId'],
    include: [
      {
        model: ProductModel,
        attributes: ['name', 'activated'],
      },
      {
        model: UserModel,
        attributes: ['name', 'activated']
      },
      {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel', 'type', 'label']
      },
    ]
  },
  {
    model: OrderProductModel,
    include: [
      {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel', 'label']
      },
    ]
  }
]

const statusBlockOnCreate = {
  analysis_return: true,
  booking_return: true,
  pending_analysis: true,
}

const quantityTotalProducts = companyId => (curr, prev) => {
  const findCurrent = curr.find(propEq('productId', prev.productId))

  if (findCurrent) {
    const sumQuantity = product => product.productId === prev.product.id ? ({
      ...product,
      quantity: product.quantity + prev.quantity,
    }) : product

    curr = curr.map(sumQuantity)
  }

  if (!findCurrent) {
    curr = [
      ...curr,
      {
        productId: prev.productId,
        quantity: prev.quantity,
        companyId,
      }
    ]
  }

  return curr
}

const updateBalance = ({ type, label }) => async ({
  productId,
  quantity,
  companyId,
}) => {
  const productBalance = await BalanceModel.findOne({ where: { productId, companyId }})
    if (label === 'booking') {
      await productBalance.update({
        booking: productBalance.booking + quantity
      })
    }

    if (label === 'booking_return') {
      await productBalance.update({
        booking: productBalance.booking_return + quantity
      })
    }

    if (label !== 'booking' && label === 'booking_return') {
      await productBalance.update({
        quantity: (
          type === 'outputs'
            ? productBalance.quantity - quantity
            : productBalance.quantity + quantity
        )
      })
    }

    await productBalance.reload()
    return productBalance
}

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const statusId = pathOr(null, ['body', 'statusId'], req)
  const customerId = pathOr(null, ['body', 'customerId'], req)
  const userId = pathOr(null, ['body', 'userId'], req)
  const createdBy = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  let pendingReview = pathOr(false, ['body', 'pendingReview'], req)
  const products = pathOr([], ['body', 'products'], req)

  try {
    const findStatus = await StatusModel.findByPk(statusId, { raw: true })
    const pendingReviewStatus = await StatusModel.findOne({ where: { label: 'pending_analysis' }})

    if (findStatus.label === 'booking') {
      pendingReview = true
    }

    if (!findStatus) {
      // se o status não estiver cadastrado não podemos criar a ordem
      throw new Error('status not register!')
    }

    if (statusBlockOnCreate[findStatus.label]) {
      // nesse caso não podemos criar uma ordem por que o restorno da reserva
      // tem que ser feito diretamente na ordem criada
      throw new Error(`cannot create a order with status ${findStatus.label}!`)
    }

    if (findStatus.label !== 'booking' && !userId && !customerId ) {
      // somente ordens com o status booking pode ser criada sem usuário ou
      // cliente
      throw new Error(`cannot create a order without user or customer to status ${findStatus.label}!`)
    }


    if(products.length === 0) {
      // toda ordem precisa ter pelo menos um produto
      throw new Error('do you need add almost a product!')
    }

    const response = await OrderModel.create({
      statusId,
      userId,
      customerId,
      pendingReview,
      companyId,
    }, { transaction, include })
    const orderId = response.id
    const formmatProduct = product => omit(['productName'], ({
      ...product,
      statusId: product.statusId === 'pending_analysis' ? pendingReviewStatus.id : product.statusId,
      orderId,
      userId: createdBy,
      companyId,
    }))

    const productOrder = (product) => ({
      ...product,
      statusId: product.statusId === 'pending_analysis' ? pendingReviewStatus.id : product.statusId,
      userId: createdBy,
      orderId: response.id,
      companyId,
    })

    const productsPayload = map(formmatProduct, products)
    const orderProductsPayload = map(productOrder, products)
    const productsTotal = products.reduce(quantityTotalProducts(companyId), [])

    await TransactionModel.bulkCreate(productsPayload, { transaction })
    await OrderProductModel.bulkCreate(orderProductsPayload, { transaction })
    await Promise.all(map(updateBalance(findStatus), productsTotal))
    await response.reload({ include, transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const orderId = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const payload = pathOr({}, ['body'], req)
  const orderProductId = pathOr(null, ['body', 'orderProductId'], req)

  try {
    const response = await OrderModel.findOne({ where: { companyId, id: orderId }, include})
    const findStatus = await StatusModel.findByPk(payload.statusId, { raw: true })
    const transactions = await TransactionModel.findAll({
        where: {
          companyId,
          productId: payload.productId,
          orderId,
        },
        include: [{
          model: StatusModel,
        }],
        raw: true
      })

    const situation = transactions.reduce((curr, prev) => {
      if (curr[prev['status.label']]) {
        curr = {
          ...curr,
          [prev['status.label']]: curr[prev['status.label']] + prev.quantity
        }
      }

      if (!curr[prev['status.label']]) {
        curr = {
          ...curr,
          [prev['status.label']]: prev.quantity
        }
      }

      return curr
    }, {
      in_analysis: 0,
      pending_analysis: 0,
      analysis_return: 0,
      booking_return: 0,
      booking: 0,
      delivery: 0,
    })

    if ((situation.analysis_return + payload.quantity) === situation.pending_analysis) {
      const updateProductOrder = await OrderProductModel.findOne({ where: { id: orderProductId }})
      await updateProductOrder.update({ statusId: response.statusId })
    }

    if (findStatus.type === 'inputs' && (situation.analysis_return === situation.pending_analysis)) {
      const updateProductOrder = await OrderProductModel.findOne({ where: { id: orderProductId }})
      await updateProductOrder.update({ statusId: response.statusId })
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'outputs' && (situation.in_analysis === situation.pending_analysis)) {
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'outputs' && payload.quantity > situation.pending_analysis) {
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'outputs' && (payload.quantity + situation.in_analysis) > situation.pending_analysis) {
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'outputs' && (payload.quantity + situation.analysis_return) > situation.pending_analysis) {
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'inputs' && payload.quantity > (situation.in_analysis - situation.analysis_return)) {
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'inputs' && situation.in_analysis === situation.analysis_return) {
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'inputs' && situation.booking_return > (situation.booking - situation.delivery)) {
      throw new Error('quantity send not allow')
    }

    if (findStatus.type === 'outputs' && situation.quantity > (situation.booking - situation.delivery)) {
      throw new Error('quantity send not allow')
    }

    if ((situation.booking_return + situation.delivery) === situation.booking) {
      const updateProductOrder = await OrderProductModel.findOne({ where: { id: orderProductId }})
      await updateProductOrder.update({ statusId: response.statusId })
      throw new Error('quantity send not allow')
    }
    
    await TransactionModel.create({
      ...payload,
      orderId,
      companyId,
    })

    await Promise.all(map(updateBalance(findStatus.type), [{
      ...payload,
      companyId,
    }]))

    await response.reload()

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await OrderModel.findOne({ where: { companyId, id: req.params.id }, include})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const { where, offset, limit } = buildSearchAndPagination({
    ...req.query,
    companyId,
  })
  const setWhereOnInclude = includeValues.map(includeValue => {
    const wheres = omit(['orderWhere'], where)
    const includeWhereAdd = wheres[includeValue.model.name]
    if(isEmpty(includeWhereAdd)) {
      return includeValue
    }

    if(!isEmpty(includeWhereAdd) && includeValue.model.name === 'transaction') {
      return {
        ...includeValue,
        include: [
          {
            model: ProductModel,
            attributes: ['name', 'activated'],
            where: includeWhereAdd
          },
          {
            model: UserModel,
            attributes: ['name', 'activated']
          },
          {
            model: StatusModel,
            attributes: [ 'value', 'color', 'typeLabel', 'type']
          },
        ]
      }
    }

    return ({
      ...includeValue,
      where: includeWhereAdd,
    })
  })

  const orderWhere = (
    isEmpty(where.orderWhere)
      ? { where: { companyId }}
      : { where: where.orderWhere }
  )
  try {
    const response = await OrderModel.findAll(
      {
      ...orderWhere,
      include: setWhereOnInclude,
      offset,
      limit,
    }
    )
    res.json({ total: response.length, source: response  })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


const getSummaryToChart = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const { where, offset, limit } = buildSearchAndPagination({ ...req.query, companyId })

  const orderWhere = (
    isEmpty(where.orderWhere)
      ? { where: { companyId } }
      : { where: where.orderWhere }
  )
  try {
    const { rows } = await OrderModel.findAndCountAll({
      ...orderWhere,
      include: {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel', 'type', 'label', 'id']
      },
      attributes: [
        [Sequelize.fn('date_trunc', 'day', Sequelize.col('order.createdAt')), 'name'],
        [Sequelize.fn('COUNT', Sequelize.col('order.createdAt')), 'count']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('order.createdAt')),
        'status.id'
      ],
      offset,
      limit,
      raw: true,
    })
    res.json({ source: parserSummaryData(rows), chartSettings: getStatusSummary(rows) })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}

const finishedOrder = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const id = pathOr(null, ['params', 'id'], req)
  try {
    const response = await OrderModel.findOne({ where: { companyId, id }, include })
    await response.update({ pendingReview: false })
    await response.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const customerAssociate =  async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const customerId = pathOr(null, ['body', 'customerId'], req)
  const id = pathOr(null, ['params', 'id'], req)

  try {
    const response = await OrderModel.findOne({ where: { companyId, id }, include })
    await response.update({ customerId })
    await response.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  customerAssociate,
  create,
  update,
  getById,
  getAll,
  getSummaryToChart,
  finishedOrder,
}
