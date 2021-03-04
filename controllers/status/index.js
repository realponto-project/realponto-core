const moment = require('moment')
const { pathOr} = require('ramda')
const database = require('../../database')
const StatusModel = database.model('status')
const buildPagination = require('../../utils/helpers/searchSpec')

const buildSearchAndPagination = buildPagination('status')

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await StatusModel.findOnw({ where: { companyId, id: req.params.id }})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = buildSearchAndPagination({
    ...pathOr({}, ['query'], req),
    companyId
  })
  try {
    const { count, rows } = await StatusModel.findAndCountAll(query)
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getById,
  getAll,
}
