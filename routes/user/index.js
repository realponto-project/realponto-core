const router = require('express').Router()
const { userController } = require('../../controllers')

router.put('/users-update-password', userController.updatePassword)
router.put('/reset-password', userController.resetPassword)
router.post('/users', userController.create)
router.get('/users', userController.getAll)
router.get('/users/:id', userController.getById)
router.put('/users/:id', userController.update)
router.post(
  '/users/send-invite-member/:userId',
  userController.sendInviteMember
)

module.exports = router
