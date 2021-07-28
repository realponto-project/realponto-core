const router = require('express').Router()
const changePriceController = require('../../controllers/changePrice')

router.get('/changePrice', changePriceController.getAllChangePrice)

module.exports = router
