const { path } = require('ramda')

const productDomain = require('../../domains/product')

const getProducts = async (req, res, next) => {
  const companyId = path(['params', 'companyId'], req)

  try {
    const { count, rows } = await productDomain.getAll(req.query, companyId)
    res.json({ count, rows })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProducts
}
