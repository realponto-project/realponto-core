const { omit, pathOr } = require('ramda')

const database = require('../../database')
const UserDomain = require('../../domains/User')

const CompanyModel = database.model('company')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const findCompany = await CompanyModel.findByPk(companyId)
    const response = await UserDomain.create(
      {
        ...req.body,
        password: findCompany.passwordUserDefault,
        companyId
      },
      { transaction }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const userWithoutPwd = omit(['password'], req.body)
  const userId = pathOr(null, ['params', 'id'], req)

  try {
    const response = await UserDomain.update(
      userId,
      {
        ...userWithoutPwd,
        companyId
      },
      { transaction }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const id = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await UserDomain.getById(id, companyId)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = pathOr({}, ['query'], req)
  try {
    const { count, rows } = await UserDomain.getAll(query, companyId)
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updatePassword = async (req, res, next) => {
  const transaction = await database.transaction()
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const bodyData = pathOr({}, ['body'], req)

  try {
    const response = await UserDomain.updatePassword(
      userId,
      {
        ...bodyData,
        companyId
      },
      { transaction }
    )

    await transaction.commit()
    res.json(response)
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
  updatePassword
}
