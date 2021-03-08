const database = require('../../database')
const CompanyModel = database.model('company')

class CompanyDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options
    return await CompanyModel.create(bodyData, { transaction })
  }
}

module.exports = new CompanyDomain()
