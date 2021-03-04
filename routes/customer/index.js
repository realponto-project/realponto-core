const router = require('express').Router()
const { customerController } = require('../../controllers')

router.post('/customers', customerController.create)
router.get('/customers', customerController.getAll)
router.get('/customers/:id', customerController.getById)
router.put('/customers/:id', customerController.update)

module.exports = router
