const { path } = require('ramda')
const moment = require('moment')

const CompanyDomain = require('../../domains/company')
const StatusDomain = require('../../domains/status')
const UserDomain = require('../../domains/User')
const database = require('../../database')

const PlanModel = database.model('plan')
const SubscriptionModel = database.model('subscription')

const statusDefault = {
  activated: true,
  value: 'initial_balance',
  label: 'Saldo inicial',
  color: '#17C9B2',
  type: 'inputs',
  typeLabel: 'Entrada'
}

const saleStatus = {
  activated: true,
  label: 'Venda',
  value: 'sale',
  color: '#5DA0FC',
  type: 'outputs',
  typeLabel: 'Saída'
}

const plan =  {
  activated: true,
  description: 'Free',
  discount: 'free',
  quantityProduct: 30,
  amount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const company = path(['body', 'company'], req)
  const user = path(['body', 'user'], req)
  
  let planFound = await PlanModel.findOne({
    where: { description: 'Free' },
    raw: true
  })

  if(!planFound) {
    await PlanModel.create(plan);
     planFound = await PlanModel.findOne({
    where: { description: 'Free' },
    raw: true
  })
  }

  try {
    const response = await CompanyDomain.create(company, { transaction })

    await StatusDomain.create(
      {
        ...statusDefault,
        companyId: response.id
      },
      { transaction }
    )

    await StatusDomain.create(
      {
        ...saleStatus,
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

    if (!planFound) throw new Error('Plan not found')

    await SubscriptionModel.create(
      {
        activated: true,
        autoRenew: false,
        amount: 0,
        companyId: response.id,
        planId: planFound.id,
        endDate: moment().add(1, 'months'),
        paymentMethod: 'free',
        status: 'free'
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

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  const companyId = path(['params', 'id'], req)
  try {
    const company = await CompanyDomain.update(companyId, req.body, {
      transaction
    })
    await transaction.commit()
    res.json(company)
  } catch (error) {
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

const getAll = async (req, res, next) => {
  try {
    const { count, rows } = await CompanyDomain.getAll(req.query)
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  getById,
  getAll,
  update
}
