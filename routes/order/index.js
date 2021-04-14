const router = require('express').Router()
const { orderController } = require('../../controllers')
const orderControllerOld = require('../../controllers/order/index.old')

router.put('/customer-associate/:id', orderControllerOld.customerAssociate)
router.put('/orders-finished/:id', orderControllerOld.finishedOrder)
router.post('/orders', orderController.create)
router.get('/orders-summary', orderControllerOld.getSummaryToChart)
router.get('/orders', orderController.getAll)
router.get('/orders/:id', orderController.getById)
router.put('/orders/:id', orderControllerOld.update)

module.exports = router
