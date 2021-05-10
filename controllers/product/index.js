const { pathOr, path } = require('ramda')

const UploadService = require('../../services/upload')
const database = require('../../database')
const ProductDomain = require('../../domains/product')

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const transaction = await database.transaction()
  try {
    const response = await ProductDomain.create(
      { ...req.body, companyId, userId },
      { transaction }
    )
    await transaction.commit()
    res.status(201).json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  const productId = path(['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)

  try {
    const response = await ProductDomain.update(
      productId,
      { ...req.body, companyId, userId },
      {
        transaction
      }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await ProductDomain.getById(req.params.id, companyId)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const { count, rows } = await ProductDomain.getAll(req.query, companyId)
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getProductByBarCode = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const barcode = pathOr(null, ['params', 'barcode'], req)
  try {
    const response = await ProductDomain.getProductByBarCode(barcode, companyId)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getTransactionsToChart = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await ProductDomain.getTransactionsToChart(
      req.params.id,
      companyId
    )
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const addImage = async (req, res, next) => {
  const transaction = await database.transaction()
  const productId = path(['body', 'productId'], req)
  const file = path(['file'], req)

  try {
    const response = await ProductDomain.addImage(productId, file, {
      transaction
    })

    await transaction.commit()
    res.json(response)
  } catch (error) {
    const uploadService = new UploadService()

    uploadService.destroyImage(file.key)
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getAllImagesByProductId = async (req, res, next) => {
  const productId = path(['params', 'productId'], req)

  try {
    const response = await ProductDomain.getAllImagesByProductId(productId)

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteImage = async (req, res, next) => {
  const transaction = await database.transaction()
  const productImageId = path(['params', 'productImageId'], req)

  try {
    await ProductDomain.removeImage(productImageId, { transaction })
    await transaction.commit()
    res.json({ message: 'Success' })
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
  getProductByBarCode,
  getTransactionsToChart,
  addImage,
  deleteImage,
  getAllImagesByProductId
}
