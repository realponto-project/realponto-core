const pagarme = require('pagarme')

const responseForTest = {
  tid: '',
  authorization_code: '',
  status: 'paid'
}

class PagarMeServices {
  async createTransactions(payload) {
    if (process.env.NODE_ENV === 'test') return responseForTest

    const conectionPagarme = await pagarme.client.connect({
      api_key: process.env.API_KEY
    })

    const transactions = await conectionPagarme.transactions.create(payload)

    return transactions
  }
}

module.exports = PagarMeServices
