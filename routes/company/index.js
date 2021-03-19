const router = require('express').Router()
const { companyController } = require('../../controllers')

router.get('/companies/:id', companyController.getById)
router.get('/companies', companyController.getAll)
router.put('/companies/:id', companyController.update)

module.exports = router
