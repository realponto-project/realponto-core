const router = require('express').Router()
const MlController = require('../../controllers/mercadoLibre')

router.post('/auth', (req, res, next) => {
  console.log(req)

  return res.send('Estará disponível em breve')
})

router.post('/ml-accounts', MlController.createAccount)
router.get('/ml-accounts', MlController.getAllAccounts)
router.get('/ml-accounts/:id', MlController.getAccount)

module.exports = router
