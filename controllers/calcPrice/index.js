const { pathOr } = require('ramda')

const database = require('../../database')

const CalcPriceModel = database.model('calcPrice')

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await CalcPriceModel.findAll({ where: { companyId } })

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAll
}
