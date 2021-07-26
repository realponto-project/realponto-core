const pagarme = require('pagarme')

const responseForTest = {
  tid: '',
  authorization_code: '',
  status: 'paid'
}

class PagarMeServices {
  async createTransactions(payload) {
    console.log('********* service pagar.me 1 *********')
    if (process.env.NODE_ENV === 'test') return responseForTest
    console.log('********* service pagar.me 2 *********')
    console.log(`*---  ${process.env.API_KEY} ---*`)

    const conectionPagarme = await pagarme.client.connect({
      api_key: process.env.API_KEY
    })

    console.log('********* service pagar.me 3 *********')
    const transactions = await conectionPagarme.transactions.create(payload)

    console.log('********* service pagar.me 4 *********')
    return transactions
  }
}

module.exports = PagarMeServices
