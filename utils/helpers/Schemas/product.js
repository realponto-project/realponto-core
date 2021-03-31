const yup = require('yup')

const productSchema = yup.object().shape({
  name: yup.string().required(),
  minQuantity: yup.number().integer().required()
})

module.exports = productSchema
