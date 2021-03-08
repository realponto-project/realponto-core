const { pathOr } = require('ramda')

const database = require('../../database')
const addressDomain = require('../Address')
const { NotFoundError } = require('../../utils/helpers/errors')
const AddressSchema = require('../../utils/helpers/Schemas/Address')
const buildPagination = require('../../utils/helpers/searchSpec')

const AddressModel = database.model('address')
const CustomerModel = database.model('customer')
const CompanyModel = database.model('company')

const buildSearchAndPagination = buildPagination('customer')

class CustomerDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    const address = pathOr({}, ['address'], bodyData)

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
      include: [AddressModel, CompanyModel]
    })
  }

  async update(id, companyId, bodyData, options = {}) {
    const { transaction = null } = options

    const customer = await CustomerModel.findByPk(id, {
      where: { companyId },
      include: [AddressModel]
    })

    if (!customer) {
      throw new NotFoundError('user not found')
    }

    const address = pathOr({}, ['address'], bodyData)

    if (await AddressSchema.isValid(address)) {
      if (customer.address) {
        await addressDomain.update(customer.addressId, address, {
          transaction
        })
      } else {
        await addressDomain.create(address, {
          transaction
        })
      }
    }

    await customer.update(bodyData, { transaction })

    return CustomerModel.findByPk(id, {
      where: { companyId },
      include: [AddressModel, CompanyModel]
    })
  }

  async getById(id, companyId) {
    return await CustomerModel.findByPk(id, {
      where: { companyId },
      include: [AddressModel, CompanyModel]
    })
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