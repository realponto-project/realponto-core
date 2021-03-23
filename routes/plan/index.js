const router = require('express').Router()
const PlanController = require('../../controllers/plan')

router.post('/plan', PlanController.create)
router.put('/plan/:id', PlanController.update)
router.get('/plan/:id', PlanController.getById)
router.get('/plan', PlanController.getAll)

module.exports = router
