const router = require('express').Router()
const { userController } = require('../../controllers')

router.put('/users-update-password', userController.updatePassword)
router.post('/users', userController.create)
router.get('/users', userController.getAll)
router.get('/users/:id', userController.getById)
router.put('/users/:id', userController.update)

module.exports = router
