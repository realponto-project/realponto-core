const { pathOr } = require('ramda')

const database = require('../../database')
const SubscriptionDomain = require('../../domains/Subscription')

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()

  try {
    const response = await SubscriptionDomain.create(
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

module.exports = {
  create
}
