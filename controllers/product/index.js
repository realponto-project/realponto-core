const { pathOr, path } = require('ramda')

const database = require('../../database')
const ProductDomain = require('../../domains/product')

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const transaction = await database.transaction()

  try {
    const response = await ProductDomain.create(
      { ...req.body, companyId, userId },
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
  const productId = path(['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)

  try {
    const response = await ProductDomain.update(
      productId,
      { ...req.body, companyId, userId },
      {
        transaction
      }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await ProductDomain.getById(req.params.id, companyId)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const { count, rows } = await ProductDomain.getAll(req.query, companyId)
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
