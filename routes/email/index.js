const router = require('express').Router()
const sendgridController = require('../../controllers/Email')

router.post('/sendMail', sendgridController.sendMail)

module.exports = router
