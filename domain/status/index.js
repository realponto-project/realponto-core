const yup = require('yup')

const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const StatusModel = database.model('status')

const buildSearchAndPagination = buildPagination('status')

class StatusDomain {
  async create(bodyData, options = {}) {
    const schema = yup.object().shape({
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
    await schema.validate(bodyData, { abortEarly: false })

    return await StatusModel.create(bodyData)
  }

  async update(bodyData, options = {}) {
    const schema = yup.object().shape({
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
    await schema.validate(bodyData, { abortEarly: false })

    const searchStatus = await StatusModel.findByPk(bodyData.id)

    return await searchStatus.update(bodyData)
  }

  async getById(id) {
    return await StatusModel.findByPk(id)
  }

  async getAll(query, companyId) {
    return await StatusModel.findAndCountAll(
      buildSearchAndPagination({
        ...query,
        companyId
      })
    )
  }
}

module.exports = new StatusDomain()
