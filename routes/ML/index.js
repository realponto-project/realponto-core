const router = require('express').Router()
const MlController = require('../../controllers/mercadoLibre')

router.post('/ml-ads', MlController.updateManyAd)
router.put('/ml-ads/:id', MlController.updateAd)

router.post('/ml-accounts', MlController.createAccount)
router.get('/ml-accounts', MlController.getAllAccounts)
router.get('/ml-accounts/:id', MlController.getAccount)
router.get('/ml-ads', MlController.getAllAds)
// router.put('/ml-ads', MlController.updateAds)
// router.put('/ml-ads-by-account/:mlAccountId', MlController.updateAdsByAccount)
// router.get('/ml-load-ads/:mlAccountId', MlController.loadAds)
// router.put('/ml-refreshToken/:id', MlController.refreshToken)
// router.get('/ml-load-ads/:mlAccountId', MlController.loadAds)

module.exports = router
