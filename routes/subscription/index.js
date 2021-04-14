const router = require('express').Router()
const subscriptionController = require('../../controllers/subscription')

router.post('/subscription', subscriptionController.create)
router.get('/subscription', subscriptionController.getSubscriptionActivated)

module.exports = router
