const yup = require('yup')

const AddressSchema = yup.object().shape({
  neighborhood: yup.string().required(),
  street: yup.string().required(),
  streetNumber: yup.string().required(),
  city: yup.string().required(),
  states: yup.string().required(),
  zipcode: yup.string().required(),
  complementary: yup.string().required(),
  reference: yup.string().required()
})

module.exports = AddressSchema
