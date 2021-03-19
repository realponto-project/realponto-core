const router = require('express').Router()
const { statusController } = require('../../controllers')

router.post('/status', statusController.create)
router.put('/status/:id', statusController.update)
router.get('/status/:id', statusController.getById)
router.get('/status', statusController.getAll)

module.exports = router
