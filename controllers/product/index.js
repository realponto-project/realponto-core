const { pathOr } = require('ramda')
const Sequelize = require('sequelize')
const database = require('../../database')
const ProductModel = database.model('product')
const BalanceModel = database.model('balance')

const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('product')
const { Op } = Sequelize
const { like } = Op

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()

  try {
    const findProduct = await ProductModel.findOne({
      where: {
        name: {
          [like]: '%'+ req.body.name +'%',
        },
        activated: true,
        companyId,
      }
    })

    if (findProduct) {
      throw new Error('Allow only one product with name activated')
    }

    const response = await ProductModel.create({...req.body, companyId }, { transaction })
    await BalanceModel.create({ productId: response.id, companyId }, { transaction })

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await ProductModel.findOne({ where: { companyId, id: req.params.id }})
    await response.update(req.body)
    await response.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await ProductModel.findOne({ where: { companyId, id: req.params.id }})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = buildSearchAndPagination({
    ...pathOr({}, ['query'], req),
    companyId,
  })
  try {
    const { count, rows } = await ProductModel.findAndCountAll({
      ...query,
      include: [BalanceModel]
    })
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
}
