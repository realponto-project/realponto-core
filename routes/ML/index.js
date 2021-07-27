const router = require('express').Router()
const MlController = require('../../controllers/mercadoLibre')

router.put('/ml-ads', MlController.updateManyAd)
router.put('/ml-ad/:id', MlController.updateAd)
router.put('/ml-ad/:id', MlController.updateActive)
router.post('/ml-accounts', MlController.createAccount)
router.get('/ml-accounts', MlController.getAllAccounts)
router.get('/ml-accounts/:id', MlController.getAccount)
router.get('/ml-ads', MlController.getAllAds)
router.put('/ml-sync-price/:id', MlController.syncPrice)
router.post('/ml-update-ads/:mlAccountId', MlController.updateAdsByAccount)

module.exports = router
