const router = require('express').Router()
const { productController } = require('../../controllers')

router.post('/products', productController.create)
router.get('/products', productController.getAll)
router.get('/products/:id', productController.getById)
router.put('/products/:id', productController.update)
router.get('/products-barcode/:barcode', productController.getProductByBarCode)

router.get(
  '/products-transactions/:id',
  productController.getTransactionsToChart
)

module.exports = router
