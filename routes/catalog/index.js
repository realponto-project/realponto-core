const router = require('express').Router()
const { getProducts } = require('../../controllers/catalog')

router.get('/get-products/:companyId', getProducts)

module.exports = router
