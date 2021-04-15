const router = require('express').Router()
const { serialNumberController } = require('../../controllers')

router.post('/serials', serialNumberController.create)
router.get('/serials', serialNumberController.getAll)
router.get('/serials/:serialNumber', serialNumberController.getById)
router.put('/serials-associate', serialNumberController.update)
router.put('/serials/:id', serialNumberController.updateSerial)

module.exports = router
