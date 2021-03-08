const yup = require('yup')

const statusSchema = yup.object().shape({
  activated: yup.boolean().required(),
  label: yup.string().required(),
  value: yup.string().required(),
  color: yup.string().required(),
  type: yup
    .string()
    .matches(/(inputs|outputs)/)
    .required(),
  typeLabel: yup
    .string()
    .matches(/(Entrada|Saída)/)
    .required(),
  fakeTransaction: yup.boolean().required(),
  companyId: yup.string().required()
})

module.exports = statusSchema