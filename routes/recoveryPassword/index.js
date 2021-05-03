const router = require('express').Router()
const { recoveryPassword } = require('../../controllers/user')

router.post('/recovery-password', recoveryPassword)

module.exports = router
