const router = require('express').Router()
const multer = require('multer')

const multerConfig = require('../../config/multer')
const { companyController } = require('../../controllers')

router.get('/companies/:id', companyController.getById)
router.get('/companies', companyController.getAll)
router.put('/companies/:id', companyController.update)
router.post(
  '/companies/add-logo',
  multer(multerConfig).single('file'),
  companyController.addLogo
)
router.delete('/companies/remove-logo', companyController.removeLogo)

module.exports = router
