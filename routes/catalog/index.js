const router = require('express').Router()
const { getProducts, getProductById } = require('../../controllers/catalog')

router.get('/get-products/:companyId', getProducts)
router.get('/get-product/:productId', getProductById)

module.exports = router
