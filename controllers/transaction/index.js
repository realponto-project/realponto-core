const { pathOr } = require('ramda')
const database = require('../../database')
const TransactionModel = database.model('transaction')
const StatusModel = database.model('status')
const ProductModel = database.model('product')

const Sequelize = require('sequelize')

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await TransactionModel.findOne({ where: { companyId, id: req.params.id }})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await TransactionModel.findAll({
      where: {
        companyId,
      },
      include:[{
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel', 'type', 'label', 'id']
      }],
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity_total']
      ],
      group: [
        'status.id',
        'product.id'
      ],
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getById,
  getAll,
}
