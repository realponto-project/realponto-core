const database = require('../../database')
const AlxaProductModel = database.model('alxa_product')
const alxaProductSchema = require('../../utils/helpers/Schemas/alxa_product')
const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('alxa_product')

class AlxaProductDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    await alxaProductSchema.validate(bodyData, { abortEarly: false })

    const findProduct = await AlxaProductModel.findOne({
      where: {
        name: bodyData.name
      }
    })

    if (findProduct) {
      throw new Error('Product with same name')
    }

    const productCreated = await AlxaProductModel.create(bodyData, {
      transaction
    })

    return productCreated
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options
    await alxaProductSchema.validate(bodyData, { abortEarly: false })

    const searchProduct = await AlxaProductModel.findByPk(id, { transaction })

    const findProduct = await AlxaProductModel.findOne({
      where: {
        name: bodyData.name
      }
    })

    if (findProduct && findProduct.id !== id) {
      throw new Error('Product with same name')
    }

    await searchProduct.update(bodyData, { transaction })

    const productUpdated = await AlxaProductModel.findByPk(id, { transaction })
    return productUpdated
  }

  async getById(id) {
    return await AlxaProductModel.findOne({
      where: { id }
    })
  }

  async getAll(query) {
    return await AlxaProductModel.findAndCountAll(
      buildSearchAndPagination({
        ...query
      })
    )
  }
}

module.exports = new AlxaProductDomain()
