const yup = require('yup')

const subscriptionSchema = yup.object().shape({
  activated: yup.boolean().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  autoRenew: yup.boolean().required(),
  paymentMethod: yup
    .string()
    .matches(/(credit_card|boleto|cash)/)
    .required(),
  statusPayment: yup.string().required(),
  planId: yup.string().required()
})

module.exports = subscriptionSchema
