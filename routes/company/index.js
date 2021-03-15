const router = require('express').Router()
const { companyController } = require('../../controllers')

router.get('/companies/:id', companyController.getById)

module.exports = router
