const buildPagination = require('../../utils/helpers/searchSpec')
const database = require('../../database')
const productSchema = require('../../utils/helpers/Schemas/product')
const { pathOr } = require('ramda')
const ProductModel = database.model('product')
const CompanyModel = database.model('company')
const SubscriptionModel = database.model('subscription')
const PlanModel = database.model('plan')
const TransactionModel = database.model('transaction')
const OrderModel = database.model('order')
const StatusModel = database.model('status')
const buildSearchAndPagination = buildPagination('product')

const statusCreated = 'initial_balance'

class ProductDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    await productSchema.validate(bodyData, { abortEarly: false })

    const count = await ProductModel.count({
      where: { companyId: bodyData.companyId }
    })

    const company = await CompanyModel.findByPk(bodyData.companyId, {
      include: [{ model: SubscriptionModel, include: [PlanModel] }]
    })

    if (
      count >= pathOr(0, ['subscription', 'plan', 'quantityProduct'], company)
    ) {
      throw new Error('Quantity product pass limit')
    }

    const findProduct = await ProductModel.findOne({
      where: {
        companyId: bodyData.companyId,
        name: bodyData.name
      }
    })

    if (findProduct) {
      throw new Error('Product with same name')
    }

    const productCreated = await ProductModel.create(bodyData, { transaction })

    if (productCreated.balance > 0) {
      const statusFinded = await StatusModel.findOne({
        where: {
          companyId: bodyData.companyId,
          value: statusCreated
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
    }
    return productCreated
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options
    await productSchema.validate(bodyData, { abortEarly: false })

    const searchProduct = await ProductModel.findByPk(id, { transaction })

    const findProduct = await ProductModel.findOne({
      where: {
        companyId: bodyData.companyId,
        name: bodyData.name
      }
    })

    if (findProduct && findProduct.id !== id) {
      throw new Error('Product with same name')
    }

    await searchProduct.update(bodyData, { transaction })

    const productUpdated = await ProductModel.findByPk(id, { transaction })
    return productUpdated
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

  async getProductByBarCode(barCode, companyId) {
    return await ProductModel.findOne({ where: { barCode, companyId } })
  }
}
module.exports = new ProductDomain()
