const { pathOr } = require('ramda')
const database = require('../../database')

const CustomerModel = database.model('customer')
const OrderModel = database.model('order')

class Metrics {
  async getMetrics(payload, options = {}) {
    const companyId = pathOr(null, ['companyId'], payload)
    const customers = await CustomerModel.count({ where: { companyId }})
    const orders = await OrderModel.count({ where: { companyId }})
    
    return ({
      customers: { value: customers },
      orders: { value: orders },
      ordersTotal: [ {
        name: '10/03/2021',
        resumeDate: '10',
        total: 4000
      }],
      ordersToday: [{ name: 'Vendas', value: 400 }]
    })
  }
}

module.exports = new Metrics()
