const yup = require('yup')

const subscriptionSchema = yup.object().shape({
  cardHash: yup.string().required(),
  amount: yup.number().positive().required(),
  installments: yup.number().positive().required(),
  planId: yup.string().required()
})

module.exports = subscriptionSchema
