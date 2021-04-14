const yup = require('yup')

const statusSchema = yup.object().shape({
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
  companyId: yup.string().required()
})

const statusSchemaUpdate = yup.object().shape({
  label: yup.string().required(),
  value: yup.string().required(),
  color: yup.string().required(),
  companyId: yup.string().required()
})

module.exports = { statusSchema, statusSchemaUpdate }
