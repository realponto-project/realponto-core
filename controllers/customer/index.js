const { pathOr } = require('ramda')

const database = require('../../database')
const CustomerDomain = require('../../domains/Customer')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const customer = pathOr({}, ['body'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await CustomerDomain.create(
      {
        ...customer,
        companyId
      },
      { transaction }
    )

    await transaction.commit()
    res.status(201).json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  const id = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await CustomerDomain.update(
      id,
      { ...req.body, companyId },
      { transaction }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

const getById = async (req, res, next) => {
  const id = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await CustomerDomain.getById(id, companyId)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = pathOr({}, ['query'], req)

  try {
    const { count, rows } = await CustomerDomain.getAll(query, companyId)
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll
}
