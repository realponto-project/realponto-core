const yup = require('yup')

const subscriptionSchema = yup.object().shape({
  activated: yup.boolean().required(),
  // autoRenew: yup.boolean().required(),
  // paymentMethod: yup
  //   .string()
  //   .matches(/(credit_card|boleto|cash)/)
  //   .required(),
  // statusPayment: yup.string().required(),
  amount: yup.number().positive().required(),
  tid: yup.string().required(),
  authorization_code: yup.string().required(),
  planId: yup.string().required()
})

module.exports = subscriptionSchema
