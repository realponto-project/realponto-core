const yup = require('yup')

const UserUpdatePwdSchema = yup.object().shape({
  password: yup.string().required(),
  newPassword: yup.string().required()
})

const UserResetPwdSchema = yup.object().shape({
  newPassword: yup.string().required()
})

module.exports = { UserUpdatePwdSchema, UserResetPwdSchema }
