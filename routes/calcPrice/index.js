const router = require('express').Router()
const { calcPriceController } = require('../../controllers')

router.get('/calcPrice', calcPriceController.getAll)

module.exports = router
