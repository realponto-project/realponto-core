const { pathOr } = require('ramda')

const database = require('../../database')
const OrderDomain = require('../../domains/Order')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await OrderDomain.create(
      { ...req.body, companyId },
      { transaction }
    )

    await transaction.commit()
    res.status(201).json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const orderId = pathOr(null, ['params', 'id'], req)
  try {
    const response = await OrderDomain.getById(orderId, companyId)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const { count, rows } = await OrderDomain.getAll(req.query, companyId)

    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  getById,
  getAll
}
