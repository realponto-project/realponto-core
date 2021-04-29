const router = require('express').Router()
const { productController } = require('../../controllers')
const multer = require('multer')
const multerConfig = require('../../config/multer')

router.post('/products', productController.create)
router.post(
  '/insert-image',
  multer(multerConfig).single('file'),
  productController.addImage
)
router.delete('/remove-image/:productImageId', productController.deleteImage)
router.get(
  '/fetch-images/:productId',
  productController.getAllImagesByProductId
)
router.get('/products', productController.getAll)
router.get('/products/:id', productController.getById)
router.put('/products/:id', productController.update)
router.get('/products-barcode/:barcode', productController.getProductByBarCode)

router.get(
  '/products-transactions/:id',
  productController.getTransactionsToChart
)

module.exports = router
