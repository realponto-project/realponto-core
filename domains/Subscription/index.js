const database = require('../../database')
const SubscricptionModel = database.model('subscription')
const SubscriptionSchema = require('../../utils/helpers/Schemas/Subscription')

class SubscriptionDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    await SubscriptionSchema.validate(bodyData, { abortEarly: false })

    return SubscricptionModel.create(bodyData, { transaction })
  }
}

module.exports = new SubscriptionDomain()
