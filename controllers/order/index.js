const { pathOr } = require('ramda')
const Sequelize = require('sequelize')

const { Op } = Sequelize
const { iLike } = Op

const database = require('../../database')
const OrderDomain = require('../../domains/Order')
const PdvSchema = require('../../utils/helpers/Schemas/Pdv')

const StatusModel = database.model('status')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userIdDecoded = pathOr(null, ['decoded', 'user', 'id'], req)
  const userId = pathOr(userIdDecoded, ['body', 'userId'], req)
  try {
    const response = await OrderDomain.create(
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

// const createPdv = async (req, res, next) => {
//   const transaction = await database.transaction()
//   const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
 
//   try {
//     const statusPdv = await StatusModel.findOne({
//       where: {
//         companyId,
//         activated: true,
//         value: {
//           [iLike]: '%sale%'
//         }
//       },
//       attributes: ['id'],
//       raw: true
//     })

//     if (!statusPdv) {
//       throw new Error('Status not found!')
//     }

//     await PdvSchema.validate(req.body)

//     const response = await OrderDomain.create(
//       { ...req.body, companyId, statusId: statusPdv.id },
//       { transaction }
//     )

//     await transaction.commit()
//     res.status(201).json(response)
//   } catch (error) {
//     await transaction.rollback()
//     res.status(400).json({ error: error.message })
//   }
// }

// const getById = async (req, res, next) => {
//   const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
//   const orderId = pathOr(null, ['params', 'id'], req)
//   try {
//     const response = await OrderDomain.getById(orderId, companyId)
//     res.json(response)
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// }

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const { count, rows } = await OrderDomain.getAll(req.query, companyId)

    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  // getById,
  getAll,
  // createPdv
}
