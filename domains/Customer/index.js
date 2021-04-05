const { pathOr } = require('ramda')

const database = require('../../database')
const addressDomain = require('../Address')
const { NotFoundError } = require('../../utils/helpers/errors')
const AddressSchema = require('../../utils/helpers/Schemas/Address')
const buildPagination = require('../../utils/helpers/searchSpec')

const AddressModel = database.model('address')
const CustomerModel = database.model('customer')

const buildSearchAndPagination = buildPagination('customer')

class CustomerDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr(null, ['companyId'], bodyData)
    const document = pathOr(null, ['document'], bodyData)
    let verifyClient = null
    const address = pathOr({}, ['address'], bodyData)
    if (document) {
      verifyClient = await CustomerModel.findOne({
        where: { companyId, document },
        include: [AddressModel]
      })
    }

    if (!verifyClient) {
      if (await AddressSchema.isValid(address)) {
        const addressCreated = await addressDomain.create(address, {
          transaction
        })
        bodyData.addressId = addressCreated.id
      }

      const customerCreated = await CustomerModel.create(bodyData, {
        transaction
      })

      return CustomerModel.findByPk(customerCreated.id, {
        include: [AddressModel],
        transaction
      })
    }

    return verifyClient
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = pathOr(null, ['companyId'], bodyData)
    const document = pathOr(null, ['document'], bodyData)

    let verifyClient = null

    const customer = await CustomerModel.findByPk(id, {
      where: { companyId },
      include: [AddressModel]
    })

    if (!customer) {
      throw new NotFoundError('customer not found')
    }

    if (document) {
      verifyClient = await CustomerModel.findOne({
        where: { companyId, document },
        include: [AddressModel]
      })
    }

    if (verifyClient) {
      if (document !== customer.document) {
        throw new NotFoundError('customer with same document')
      }
    }

    const address = pathOr({}, ['address'], bodyData)

    if (await AddressSchema.isValid(address)) {
      if (customer.address) {
        await addressDomain.update(customer.addressId, address, {
          transaction
        })
      } else {
        const { id } = await addressDomain.create(address, {
          transaction
        })

        bodyData.addressId = id
      }
    }

    await customer.update(bodyData, { transaction })

    return CustomerModel.findByPk(id, {
      where: { companyId },
      include: [AddressModel],
      transaction
    })
  }

  async getById(id, companyId) {
    if (!id) {
      throw new Error('customer id should not be null!')
    }

    const customerFound = await CustomerModel.findByPk(id, {
      where: { companyId },
      include: [AddressModel]
    })

    return customerFound || {}
  }

  async getAll(query, companyId) {
    return await CustomerModel.findAndCountAll(
      buildSearchAndPagination({
        ...query,
        companyId
      })
    )
  }
}

module.exports = new CustomerDomain()
