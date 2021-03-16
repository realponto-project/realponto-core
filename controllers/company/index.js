const { path } = require('ramda')
const CompanyDomain = require('../../domains/company')
const StatusDomain = require('../../domains/status')
const UserDomain = require('../../domains/User')
const database = require('../../database')

const statusDefault = {
  activated: true,
  label: 'initial_balance',
  value: 'Saldo inicial',
  color: '#17C9B2',
  type: 'inputs',
  typeLabel: 'Entrada'
}

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const company = path(['company'], req.body)
  const user = path(['user'], req.body)
  try {
    const response = await CompanyDomain.create(company, { transaction })

    await StatusDomain.create(
      {
        ...statusDefault,
        companyId: response.id
      },
      { transaction }
    )

    await UserDomain.create(
      {
        ...user,
        companyId: response.id
      },
      { transaction }
    )
    res.status(201).json(response)
    await transaction.commit()
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await CompanyDomain.getById(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  getById
}
