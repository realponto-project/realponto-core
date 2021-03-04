const { pathOr } = require('ramda')
const database = require('../../database')

const SerialNumberModel = database.model('serialNumber')
const OrderModel = database.model('order')
const ProductModel = database.model('product')
const UserModel = database.model('user')
const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('serialNumber')

const include = [
  UserModel,
  ProductModel,
  OrderModel,
]

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userId = pathOr(null, ['body', 'userId'], req)
  const orderId = pathOr(null, ['body', 'orderId'], req)
  const serialNumbers = pathOr([], ['body', 'serialNumbers'], req)
  const productId = pathOr(null, ['body', 'productId'], req)

  const payload = serialNumber => ({
    serialNumber,
    orderId,
    productId,
    userId,
    companyId
  })

  try {
    console.log('serialNumbers.map(payload)', serialNumbers.map(payload))
    const response = await SerialNumberModel.bulkCreate(serialNumbers.map(payload), { transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const serialNumbers = pathOr(null, ['body', 'serialNumbers'], req)
  const orderId = pathOr(null, ['body', 'orderId'], req)

  try {
    const response = await SerialNumberModel.update({
      activated: false,
      transactionOutId: orderId,
    },{
      where: {
        serialNumber: serialNumbers,
        activated: true,
        companyId
      }
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const serialNumber = pathOr(null, ['params', 'serialNumber'], req)
  try {
    const response = await SerialNumberModel.findOne({ where: { serialNumber, companyId }})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = buildSearchAndPagination({
    ...pathOr({}, ['query'], req),
    companyId,
  })
  console.log(query, req.query)
  try {
    const response = await SerialNumberModel.findAll({...query, include })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
}
