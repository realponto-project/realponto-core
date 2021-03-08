const database = require('../../database')

const AddressModel = database.model('address')

class AddressDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    return await AddressModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    const address = await AddressModel.findByPk(id)

    return await address.update(bodyData, { transaction })
  }
}

module.exports = new AddressDomain()
