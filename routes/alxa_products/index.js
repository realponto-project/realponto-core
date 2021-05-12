const router = require('express').Router()
const AlxaProductController = require('../../controllers/alxa_product')

router.post('/alxaProducts', AlxaProductController.create)
router.get('/alxaProducts', AlxaProductController.getAll)
router.get('/alxaProducts/:id', AlxaProductController.getById)
router.put('/alxaProducts/:id', AlxaProductController.update)

module.exports = router
