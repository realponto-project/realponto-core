const { path } = require('ramda')

const database = require('../../database')
const AlxaProductDomain = require('../../domains/Alxa_Products.js')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const response = await AlxaProductDomain.create(
      { ...req.body },
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

  try {
    const response = await AlxaProductDomain.update(
      productId,
      { ...req.body },
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
  try {
    const response = await AlxaProductDomain.getById(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  try {
    const { count, rows } = await AlxaProductDomain.getAll(req.query)
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
