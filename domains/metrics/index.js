const { pathOr } = require('ramda')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { gte, lte } = Op
const moment = require('moment')

const database = require('../../database')
const CustomerModel = database.model('customer')
const OrderModel = database.model('order')
const StatusModel = database.model('status')

class Metrics {
  async getMetrics(payload, options = {}) {
    const companyId = pathOr(null, ['companyId'], payload)
    const customers = await CustomerModel.count({ where: { companyId } })

    const ordersLast15Days = await OrderModel.findAll({
      where: {
        companyId,
        createdAt: {
          [gte]: moment()
            .subtract(14, 'day')
            .startOf('day')
            .utc()
            .toISOString(),
          [lte]: moment().endOf('day').utc().toISOString()
        }
      },
      include: {
        model: StatusModel,
        attributes: ['value', 'color', 'typeLabel', 'type', 'label', 'id']
      },
      attributes: [
        [
          Sequelize.fn('date_trunc', 'day', Sequelize.col('order.createdAt')),
          'name'
        ],
        [Sequelize.fn('COUNT', Sequelize.col('order.createdAt')), 'total']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('order.createdAt')),
        'status.id'
      ],
      raw: true
    })

    const orders = await OrderModel.count({
      where: { companyId },
      include: [{ model: StatusModel, where: { value: 'sale' } }]
    })
    const buildResponse = ordersLast15Days
      .filter((item) => item['status.value'] === 'sale')
      .map((order) => {
        return {
          name: order.name,
          total: Number(order.total),
          resumeDate: `${moment(order.name)
            .toISOString()
            .substr(8, 2)}/${moment(order.name).toISOString().substr(5, 2)}`
        }
      })

    const filterOrders = (item) =>
      moment(item.name).add(1, 'day').format('DD') === moment().format('DD')
    const ordersToday = buildResponse.find(filterOrders)

    return {
      customers: { value: customers },
      orders: { value: orders },
      ordersTotal: buildResponse,
      ordersToday: [ordersToday] || []
    }
  }
}

module.exports = new Metrics()
