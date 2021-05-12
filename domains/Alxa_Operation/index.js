const { pathOr, pipe, includes, add } = require('ramda')

const database = require('../../database')
const PagarMeService = require('../../services/pagarMe')
const buildPagination = require('../../utils/helpers/searchSpec')

const AlxaProductModel = database.model('alxa_product')
const AlxaOperationModel = database.model('alxa_operation')
const CompanyModel = database.model('company')
const UserModel = database.model('user')

const buildSearchAndPagination = buildPagination('alxa_operation')

class AlxaOperationDomain {
  async create(payload, options = {}) {
    const { transaction = null } = options
    const alxaProductId = pathOr(null, ['alxaProductId'], payload)
    const companyId = pathOr(null, ['companyId'], payload)
    const userId = pathOr(null, ['userId'], payload)

    const alxaProduct = await AlxaProductModel.findByPk(alxaProductId, {
      transaction
    })

    const company = await CompanyModel.findByPk(companyId, {
      transaction
    })

    if (!alxaProduct) throw new Error('alxa_product not found')

    if (!company) throw new Error('company not found')

    if (alxaProduct.type === 'credit_buy') {
      const card_hash = pathOr(null, ['card_hash'], payload)

      const transactionPayloadPagarme = {
        api_key: process.env.API_KEY,
        card_hash,
        amount: alxaProduct.salePrice,
        items: [
          {
            id: alxaProductId,
            title: alxaProduct.name,
            unit_price: alxaProduct.salePrice,
            quantity: 1,
            tangible: false
          }
        ]
      }

      const pagarMeService = new PagarMeService()

      const transactionPagarme = await pagarMeService.createTransactions(
        transactionPayloadPagarme
      )

      const bonus = pipe(
        pathOr('{}', ['description']),
        (value) => JSON.parse(value),
        pathOr(0, ['bonus'])
      )(alxaProduct)

      const credtiMovement = alxaProduct.salePrice * 10 + bonus

      const alxaOperationValues = {
        details: JSON.stringify(transactionPagarme),
        type: alxaProduct.type,
        amount: credtiMovement,
        companyId,
        userId
      }

      const alxaOperation = await AlxaOperationModel.create(
        alxaOperationValues,
        {
          transaction
        }
      )

      if (includes(transactionPagarme.status, ['paid', 'autorizated'])) {
        await company.update(
          { goldBalance: add(company.goldBalance, credtiMovement) },
          { transaction }
        )
      }
      return alxaOperation
    } else {
      const credtiMovement = alxaProduct.salePrice * 10

      const alxaOperationValues = {
        details: payload?.details,
        type: alxaProduct.type,
        amount: credtiMovement,
        companyId,
        userId
      }

      const alxaOperation = await AlxaOperationModel.create(
        alxaOperationValues,
        {
          transaction
        }
      )

      // Investigar o type para saber se é saída ou entrada de credito
      await company.update(
        {},
        // { goldBalance: subtract(company.goldBalance, credtiMovement) },
        // { goldBalance: add(company.goldBalance, credtiMovement) },
        { transaction }
      )
      return alxaOperation
    }
  }

  async getAll(query, companyId) {
    const alxaOperations = await AlxaOperationModel.findAndCountAll({
      ...buildSearchAndPagination({
        ...query,
        companyId
      }),
      include: UserModel
    })

    return alxaOperations
  }
}

module.exports = new AlxaOperationDomain()
