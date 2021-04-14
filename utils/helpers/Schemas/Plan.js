const yup = require('yup')

const planSchema = yup.object().shape({
  activated: yup.boolean().required(),
  description: yup.string().required(),
  discount: yup.string().required(),
  quantityProduct: yup.number().required(),
  amount: yup.number().required()
})

module.exports = planSchema
