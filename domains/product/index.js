const yup = require('yup')

const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const ProductModel = database.model('product')

const buildSearchAndPagination = buildPagination('product')

class ProductDomain {
  async create(bodyData, options = {}) {
    const schema = yup.object().shape({
      activated: yup.boolean().required(),
      name: yup.string().required(),
      barCode: yup.string().required(),
      minQuantity: yup.number().integer().required(),
      buyPrice: yup.number().positive().required(),
      salePrice: yup.number().positive().required(),
      companyId: yup.string().required()
    })
    await schema.validate(bodyData, { abortEarly: false })
    return await ProductModel.create(bodyData)
  }

  async update(bodyData, options = {}) {
    const schema = yup.object().shape({
      activated: yup.boolean().required(),
      name: yup.string().required(),
      barCode: yup.string().required(),
      minQuantity: yup.number().integer().required(),
      buyPrice: yup.number().positive().required(),
      salePrice: yup.number().positive().required(),
      companyId: yup.string().required()
    })
    await schema.validate(bodyData, { abortEarly: false })

    const searchProduct = await ProductModel.findByPk(bodyData.id)

    return await searchProduct.update(bodyData)
  }

  async getById(id) {
    return await ProductModel.findByPk(id)
  }

  async getAll(query, companyId) {
    return await ProductModel.findAndCountAll(
      buildSearchAndPagination({
        ...query,
        companyId
      })
    )
  }
}

module.exports = new ProductDomain()
