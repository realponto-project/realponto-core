const router = require('express').Router()

router.post('/auth', (req, res, next) => {
  console.log(req)

  return res.send('Estará disponível em breve')
})

module.exports = router
