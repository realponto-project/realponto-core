const router = require('express').Router()
const { authenticationController } = require('../../controllers')

router.post('/login', authenticationController.authentication)

module.exports = router
