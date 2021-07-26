/* eslint-disable camelcase */
const { pathOr } = require('ramda')

const database = require('../../database')
const SubscriptionDomain = require('../../domains/Subscription')
const PlanDomain = require('../../domains/Plan')
const PagarMeService = require('../../services/pagarMe')

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()
  const planId = pathOr(null, ['body', 'planId'], req)
  const planIdFound = await PlanDomain.getPlanById(planId)

  console.log('********* controller 1 *********')

  if (!planIdFound.activated) {
    throw new Error('Plan unavaible!')
  }

  console.log('********* controller 2 *********')

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

    const pagarMeService = new PagarMeService()

    const {
      tid,
      authorization_code,
      status
    } = await pagarMeService.createTransactions(transactionSpecPagarme)

    console.log('********* controller 3 *********')
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
    console.log('********* controller 4 *********')

    await transaction.commit()
    res.status(201).json(response)
  } catch (error) {
    await transaction.rollback()
    console.log('error >>>', error)

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
