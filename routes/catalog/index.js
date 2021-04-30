const router = require('express').Router()
const {
  getProducts,
  getProductById,
  getCompanyById
} = require('../../controllers/catalog')

router.get('/get-products/:companyId', getProducts)
router.get('/get-product/:productId', getProductById)
router.get('/get-company/:companyId', getCompanyById)

module.exports = router
