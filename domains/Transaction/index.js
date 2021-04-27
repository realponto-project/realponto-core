const yup = require('yup')
const Sequelize = require('sequelize')
const {
  reduceBy,
  path,
  add,
  applySpec,
  pathOr,
  pipe,
  subtract
} = require('ramda')

const database = require('../../database')

const TransactionModal = database.model('transaction')
const StatusModal = database.model('status')
const ProductModel = database.model('product')

const schemaCreateTransaction = yup.object().shape({
  orderId: yup.string().required(),
  statusId: yup.string().required(),
  userId: yup.string().required(),
  companyId: yup.string().required(),
  productId: yup.string().required(),
  quantity: yup.number().required().min(1).integer(),
  price: yup.number().required().min(0).integer()
})

const schemaQuantities = yup.object().shape({
  inputs: yup.number().required().min(0).integer(),
  outputs: yup.number().required().min(0).integer()
})

class TransactionDomain {
  async create(payload, options = {}) {
    const { transaction = null } = options

    await schemaCreateTransaction.validate(payload, { abortEarly: false })

    const quantities = await TransactionModal.findAll({
      where: { orderId: payload.orderId, productId: payload.productId },
      include: { model: StatusModal, attributes: ['id', 'type'] },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity']
      ],
      group: ['status.id'],
      raw: true,
      transaction
    })

    const quantitiesFormated = pipe(
      applySpec({
        inputs: pathOr(0, ['inputs']),
        outputs: pathOr(0, ['outputs'])
      })
    )(
      reduceBy(
        (value, { quantity }) => add(Number(quantity), value),
        0,
        path(['status.type']),
        quantities
      )
    )

    await schemaQuantities.validate(quantitiesFormated, { abortEarly: false })

    const { inputs, outputs } = quantitiesFormated

    console.log(payload, quantitiesFormated)

    if (inputs + payload.quantity > outputs) throw new Error('Invalid quantity')

    const status = await StatusModal.findByPk(payload.statusId, {
      transaction,
      raw: true
    })

    const product = await ProductModel.findByPk(payload.productId, {
      transaction
    })

    const balanceOBJ = {
      inputs: add(product.balance, payload.quantity),
      outputs: subtract(product.balance, payload.quantity)
    }

    const balance = balanceOBJ[status.type]

    await product.update({ balance }, { transaction })

    const transactionCreated = await TransactionModal.create(payload, {
      transaction
    })

    return transactionCreated
  }
}

module.exports = new TransactionDomain()
