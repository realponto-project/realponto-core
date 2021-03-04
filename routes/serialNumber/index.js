const router = require('express').Router()
const { serialNumberController } = require('../../controllers')

router.post('/serials', serialNumberController.create)
router.get('/serials', serialNumberController.getAll)
router.get('/serials/:serialNumber', serialNumberController.getById)
router.put('/serials-associate', serialNumberController.update)

module.exports = router
