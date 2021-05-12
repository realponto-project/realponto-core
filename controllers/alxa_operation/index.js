const { pathOr } = require('ramda')
const database = require('../../database')

const alxaOperationDomain = require('../../domains/Alxa_Operation')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const alxaProductId = pathOr(null, ['body', 'alxaProductId'], req)

  try {
    const response = await alxaOperationDomain.create(
      {
        alxaProductId,
        companyId,
        card_hash: pathOr(null, ['body', 'cardHash'], req),
        userId
      },
      { transaction }
    )

    res.status(201).json(response)
    await transaction.commit()
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
    await transaction.rollback()
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const { count, rows } = await alxaOperationDomain.getAll(
      req.query,
      companyId
    )

    res.json({ total: count, source: rows })
  } catch (err) {
    console.error(err)

    res.status(400).json({ message: err.message })
  }
}

module.exports = {
  create,
  getAll
}
