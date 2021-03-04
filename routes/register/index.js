const router = require('express').Router()
const { companyController } = require('../../controllers')

router.post('/register', companyController.create)

module.exports = router
