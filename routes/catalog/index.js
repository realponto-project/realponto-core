const router = require('express').Router()
const {
  getProducts,
  getProductById,
  getCompanyByNickName
} = require('../../controllers/catalog')

router.get('/get-products/:nickName', getProducts)
router.get('/get-product/:productId', getProductById)
router.get('/get-company/:nickName', getCompanyByNickName)

module.exports = router
