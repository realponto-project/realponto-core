const yup = require('yup')

const ProductSchema = yup.object().shape({
  productId: yup.string().required(),
  quantity: yup.number().integer().positive().required()
})

const PdvSchema = yup.object().shape({
  discount: yup.number().integer().required(),
  payment: yup
    .string()
    .matches(
      /(money|boleto|card_debit_master|card_debit_visa|card_credit_master|card_credit_visa)/
    )
    .required(),
  type: yup
    .string()
    .matches(/(fast|delivery)/)
    .required(),
  products: yup.array(ProductSchema).required()
})

module.exports = PdvSchema
