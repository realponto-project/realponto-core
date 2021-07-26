/* eslint-disable camelcase */
const { pathOr } = require('ramda')

const database = require('../../database')
const SubscriptionDomain = require('../../domains/Subscription')
const PlanDomain = require('../../domains/Plan')
const PagarMeService = require('../../services/pagarMe')

const CompanyModel = database.model('company')

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()
  const planId = pathOr(null, ['body', 'planId'], req)
  const planIdFound = await PlanDomain.getPlanById(planId)

  if (!planIdFound.activated) {
    throw new Error('Plan unavaible!')
  }

  try {
    const company = await CompanyModel.findByPk(companyId)

    if (!company) throw new Error('company not found')

    const transactionSpecPagarme = {
      api_key: process.env.API_KEY,
      card_hash: pathOr(null, ['body', 'cardHash'], req),
      amount: pathOr(null, ['body', 'amount'], req),
      billing: {
        name: `${company.id} - ${company.name}`,
        address: {
          country: 'br',
          state: 'sp',
          city: 'São Bernardo do Campo',
          neighborhood: 'Nova Petrópolis',
          street: 'Av. Imperador Pedro II',
          street_number: '1201',
          zipcode: '09770420'
        }
      },
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
    console.log('error >>>', error)

    res.status(400).json({ messege: error.message, error: error })
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
