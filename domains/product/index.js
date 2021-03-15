const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const productSchema = require('../../utils/helpers/Schemas/product')

const ProductModel = database.model('product')
const TransactionModel = database.model('transaction')
const OrderModel = database.model('order')
const StatusModel = database.model('status')

const buildSearchAndPagination = buildPagination('product')
const statusCreate = 'initial_balance'

class ProductDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    await productSchema.validate(bodyData, { abortEarly: false })
    const productCreated = await ProductModel.create(bodyData, { transaction })
    const statusFinded = await StatusModel.findOne({
      where: {
        companyId: bodyData.companyId,
        label: statusCreate
      }
    })
    const orderCreated = await OrderModel.create(
      {
        companyId: bodyData.companyId,
        statusId: statusFinded.id,
        userId: bodyData.userId
      },
      { transaction }
    )

    await TransactionModel.create(
      {
        orderId: orderCreated.id,
        statusId: statusFinded.id,
        quantity: productCreated.balance,
        productId: productCreated.id,
        userId: bodyData.userId,
        companyId: bodyData.companyId
      },
      { transaction }
    )

    return productCreated
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options
    await productSchema.validate(bodyData, { abortEarly: false })

    const searchProduct = await ProductModel.findByPk(id)
    await searchProduct.update(bodyData, { transaction })
    await searchProduct.reload()

    return searchProduct
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
