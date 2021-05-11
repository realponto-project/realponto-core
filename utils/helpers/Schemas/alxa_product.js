const yup = require('yup')

const productSchema = yup.object().shape({
  name: yup.string().required()
})

module.exports = productSchema
