const { pathOr } = require('ramda')
const pagarme = require('pagarme')

const database = require('../../database')
const SubscriptionDomain = require('../../domains/Subscription')
const PlanDomain = require('../../domains/Plan')

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()
  const planId = pathOr(null, ['body', 'planId'], req)
  const planIdFound = await PlanDomain.getPlanById(planId)

  if (!planIdFound.activated) {
    throw new Error('Plan unavaible!')
  }

  try {
    const transactionSpecPagarme = {
      api_key: process.env.API_KEY,
      card_hash: pathOr(null, ['body', 'cardHash'], req),
      amount: pathOr(null, ['body', 'amount'], req),
      items: [
        {
          id: planId,
          title: 'Anual',
          unit_price: pathOr(null, ['body', 'amount'], req),
          quantity: 1,
          tangible: false
        }
      ]
    }

    const conectionPagarme = await pagarme.client.connect({
      api_key: process.env.API_KEY
    })
    const {
      tid,
      // eslint-disable-next-line camelcase
      authorization_code,
      status
    } = await conectionPagarme.transactions.create(transactionSpecPagarme)

    const activated = !!(status === 'paid' || status === 'autorizated')

    const response = await SubscriptionDomain.create(
      {
        ...req.body,
        companyId,
        tid,
        authorization_code,
        status,
        activated
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

const getSubscriptionActivated = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await SubscriptionDomain.getSubscriptionActivated(
      companyId
    )
    res.status(200).json(response)
  } catch (error) {
    res.status(404).json({ error })
  }
}

module.exports = {
  create,
  getSubscriptionActivated
}
