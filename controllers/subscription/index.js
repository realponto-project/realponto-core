const { pathOr } = require('ramda')
const pagarme = require('pagarme')

const database = require('../../database')
const SubscriptionDomain = require('../../domains/Subscription')

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()

  try {
    const transactionSpecPagarme = {
      api_key: process.env.API_KEY,
      card_number: '4111111111111111',
      card_cvv: '123',
      card_expiration_date: '0922',
      card_holder_name: 'Morpheus Fishburne',
      amount: req.body.amount,
      items: [
        {
          id: req.body.planId,
          title: 'anual 150',
          unit_price: req.body.amount,
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
      authorization_code,
      status
    } = await conectionPagarme.transactions.create(transactionSpecPagarme)

    const response = await SubscriptionDomain.create(
      { ...req.body, companyId, tid, authorization_code, status },
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
