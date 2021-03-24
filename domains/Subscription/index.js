const database = require('../../database')
const SubscricptionModel = database.model('subscription')
const PlanModel = database.model('plan')
const SubscriptionSchema = require('../../utils/helpers/Schemas/Subscription')
const moment = require('moment')

class SubscriptionDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    await SubscriptionSchema.validate(bodyData, { abortEarly: false })

    const searchPlanActivated = await PlanModel.findOne({
      where: { id: bodyData.planId, activated: true }
    })

    if (searchPlanActivated === null) {
      throw new Error('Erro')
    }

    return SubscricptionModel.create(
      { ...bodyData, endDate: moment().add(13, 'months').format('L') },
      { transaction }
    )
  }
}

module.exports = new SubscriptionDomain()
