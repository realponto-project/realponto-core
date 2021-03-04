const router = require('express').Router()
const { transactionController } = require('../../controllers')

router.get('/transactions', transactionController.getAll)
router.get('/transactions/:id', transactionController.getById)

module.exports = router
