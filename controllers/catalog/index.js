const { path } = require('ramda')
const database = require('../../database')

const ProductModel = database.model('product')
const CompanyModel = database.model('company')

const productDomain = require('../../domains/product')

const getProducts = async (req, res, next) => {
  const companyId = path(['params', 'companyId'], req)

  try {
    const { count, rows } = await productDomain.getAll(
      { ...req.query, activated: true },
      companyId
    )
    res.json({ count, rows })
  } catch (err) {
    next(err)
  }
}

const getProductById = async (req, res, next) => {
  const productId = path(['params', 'productId'], req)

  try {
    const product = await ProductModel.findByPk(productId, {
      include: CompanyModel
    })

    res.json(product)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProducts,
  getProductById
}
