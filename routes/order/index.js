const router = require('express').Router()
const { orderController } = require('../../controllers')

router.put('/customer-associate/:id', orderController.customerAssociate)
router.put('/orders-finished/:id', orderController.finishedOrder)
router.post('/orders', orderController.create)
router.get('/orders-summary', orderController.getSummaryToChart)
router.get('/orders', orderController.getAll)
router.get('/orders/:id', orderController.getById)
router.put('/orders/:id', orderController.update)

module.exports = router
