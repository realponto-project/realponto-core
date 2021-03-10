const yup = require('yup')

const companySchema = yup.object().shape({
  name: yup.string().required(),
  fullname: yup.string().required(),
  document: yup.string().required(),
  siteUrl: yup.string().required(),
  allowOrder: yup.boolean().required(),
  allowPdv: yup.boolean().required(),
  companyId: yup.string().required()
})

module.exports = companySchema
