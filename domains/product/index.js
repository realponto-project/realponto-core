const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const productSchema = require('../../utils/helpers/Schemas/product')

const ProductModel = database.model('product')

const buildSearchAndPagination = buildPagination('product')

class ProductDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    await productSchema.validate(bodyData, { abortEarly: false })
    return await ProductModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options
    await productSchema.validate(bodyData, { abortEarly: false })

    const searchProduct = await ProductModel.findByPk(id)

    return await searchProduct.update(bodyData, { transaction })
  }

  async getById(id, companyId) {
    return await ProductModel.findOne({ where: { companyId, id } })
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
