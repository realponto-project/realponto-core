const { pathOr, isEmpty } = require('ramda')
const database = require('../../database')

const SerialNumberModel = database.model('serialNumber')
const OrderModel = database.model('order')
const ProductModel = database.model('product')
const UserModel = database.model('user')
const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('serialNumber')

const include = [UserModel, ProductModel, OrderModel]

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const orderId = pathOr(null, ['body', 'orderId'], req)
  const serialNumbers = pathOr([], ['body', 'serialNumbers'], req)
  const productId = pathOr(null, ['body', 'productId'], req)

  const payload = (serialNumber) => ({
    serialNumber,
    orderId,
    productId,
    userId,
    companyId
  })

  try {
    const response = await SerialNumberModel.bulkCreate(
      serialNumbers.map(payload),
      { transaction }
    )
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
    const response = await SerialNumberModel.update(
      {
        activated: false,
        transactionOutId: orderId
      },
      {
        where: {
          serialNumber: serialNumbers,
          activated: true,
          companyId
        }
      }
    )
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const serialNumber = pathOr(null, ['params', 'serialNumber'], req)
  try {
    const response = await SerialNumberModel.findOne({
      where: { serialNumber, companyId }
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = buildSearchAndPagination({
    ...pathOr({}, ['query'], req),
    companyId
  })
  try {
    const response = await SerialNumberModel.findAndCountAll({
      ...query,
      include
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateSerial = async (req, res, next) => {
  const serialId = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const serialNumber = pathOr('', ['body', 'serialNumber'], req)
  try {
    const response = await SerialNumberModel.findOne({
      where: { companyId, id: serialId, activated: true }
    })

    if (serialNumber && !isEmpty(serialNumber)) {
      await response.update({ serialNumber })
      await response.reload()
    }

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
  updateSerial
}
