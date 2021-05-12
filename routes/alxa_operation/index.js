const router = require('express').Router()
const AlxaOperationController = require('../../controllers/alxa_operation')

router.post('/alxaOperation', AlxaOperationController.create)
router.get('/alxaOperation', AlxaOperationController.getAll)

module.exports = router
