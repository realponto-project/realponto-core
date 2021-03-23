const { path } = require('ramda')

const database = require('../../database')
const PlanDomain = require('../../domains/Plan')

const create = async (req, res, next) => {
  const transaction = await database.transaction()

  try {
    const response = await PlanDomain.create(req.body, { transaction })

    await transaction.commit()
    res.status(201).json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  const planId = path(['params', 'id'], req)

  try {
    const response = await PlanDomain.update(planId, req.body, {
      transaction
    })

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  try {
    const { count, rows } = await PlanDomain.getAll(req.query)
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getAll
}
