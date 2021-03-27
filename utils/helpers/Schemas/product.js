const yup = require('yup')

const productSchema = yup.object().shape({
  name: yup.string().required(),
  minQuantity: yup.number().integer().required(),
  companyId: yup.string().required(),
  userId: yup.string()
})

module.exports = productSchema
