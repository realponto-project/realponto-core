const yup = require('yup')

const productSchema = yup.object().shape({
  activated: yup.boolean().required(),
  balance: yup.number().integer().required(),
  name: yup.string().required(),
  barCode: yup.string().required(),
  minQuantity: yup.number().integer().required(),
  buyPrice: yup.number().positive().required(),
  salePrice: yup.number().positive().required(),
  companyId: yup.string().required(),
  userId: yup.string()
})

module.exports = productSchema
