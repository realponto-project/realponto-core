const router = require('express').Router()
const subscriptionController = require('../../controllers/subscription')

router.post('/subscription', subscriptionController.create)

module.exports = router
