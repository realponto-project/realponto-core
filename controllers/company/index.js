const { pathOr, omit } = require('ramda')
const { hash } = require('bcrypt')
const database = require('../../database')
const CompanyModel = database.model('company')
const UserModel = database.model('user')
const StatusModel = database.model('status')

const statusDefault = [
  {
    label: 'delivery',
    value: 'Entregue',
    color: '#5DA0FC',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'sale',
    value: 'Venda',
    color: '#5DA0FC',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'ecommerce',
    value: 'Ecommerce',
    color: '#268E86',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'free_market',
    value: 'Mercado Livre',
    color: '#F29F03',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'outputs',
    value: 'Saída',
    color: '#EA5656',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'tenancy',
    value: 'Locação',
    color: '#2D2D2D',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'in_analysis',
    value: 'Em Análise',
    color: '#D588F2',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'repair',
    value: 'Conserto',
    color: '#F2CB03',
    type: 'outputs',
    typeLabel: 'Saída',
  },
  {
    label: 'buy',
    value: 'Compra',
    color: '#17C9B2',
    type: 'inputs',
    typeLabel: 'Entrada',
  },
  {
    label: 'inputs',
    value: 'Entrada',
    color: '#7250D8',
    type: 'inputs',
    typeLabel: 'Entrada',
  },
  {
    label: 'exchange',
    value: 'Troca',
    color: '#5D3F90',
    type: 'inputs',
    typeLabel: 'Entrada',
  },
  {
    label: 'pending_analysis',
    value: 'Aguardando análise',
    color: '#CC3A4F',
    type: 'inputs',
    typeLabel: 'Entrada',
  },
  {
    label: 'analysis_return',
    value: 'Retorno Análise',
    color: '#984141',
    type: 'inputs',
    typeLabel: 'Entrada',
  },
  {
    label: 'repair_return',
    value: 'Retorno Conserto',
    color: '#264ABE',
    type: 'inputs',
    typeLabel: 'Entrada',
  },
  {
    label: 'tenancy_with_pending_analysis_return',
    value: 'Retorno Locação e Aguardando Análise',
    color: '#87d068',
    type: 'inputs',
    typeLabel: 'Entrada',
  },
]

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const company = omit(['user'], req.body)
  const user = pathOr(null, ['body', 'user'], req)

  try {
    const password = await hash(user.password, 10)
    const response = await CompanyModel.create(company, { transaction })
    const statusWithCompanyId = statusDefault.map(status => ({...status, companyId: response.id}))
    await StatusModel.bulkCreate(statusWithCompanyId, { transaction })
    await UserModel.create({
      ...user,
      password,

    }, { transaction })

    res.json(response)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await CompanyModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  getById,
}
