const database = require('../../database')
const StatusModel = database.model('status')

class StatusDomain {
  async create(bodyData, options = {}) {
    await StatusModel.create(bodyData)
  }
}

module.exports = new StatusDomain()
