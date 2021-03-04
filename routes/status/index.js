const router = require('express').Router()
const { statusController } = require('../../controllers')

router.get('/status', statusController.getAll)
router.get('/status/:id', statusController.getById)

module.exports = router
