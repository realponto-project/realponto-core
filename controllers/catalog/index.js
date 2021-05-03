const { path } = require('ramda')
const database = require('../../database')

const ProductModel = database.model('product')
const CompanyModel = database.model('company')
const ProductImageModel = database.model('productImage')

const productDomain = require('../../domains/product')

const getProducts = async (req, res, next) => {
  const companyId = path(['params', 'companyId'], req)

  try {
    const { count, rows } = await productDomain.getAllWithImage(
      { ...req.query, activated: true },
      companyId
    )

    res.json({ count, rows })
  } catch (err) {
    next(err)
  }
}

const getCompanyById = async (req, res, next) => {
  const companyId = path(['params', 'companyId'], req)

  try {
    const company = await CompanyModel.findByPk(companyId)

    res.json(company)
  } catch (err) {
    next(err)
  }
}

const getProductById = async (req, res, next) => {
  const productId = path(['params', 'productId'], req)

  try {
    const product = await ProductModel.findByPk(productId, {
      include: [CompanyModel, ProductImageModel]
    })

    res.json(product)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProducts,
  getProductById,
  getCompanyById
}