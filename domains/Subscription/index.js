const database = require('../../database')
const SubscriptionModel = database.model('subscription')
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

    if (!searchPlanActivated) {
      throw new Error('Erro')
    }

    return SubscriptionModel.create(
      {
        ...bodyData,
        endDate: moment().add(13, 'months')
      },
      { transaction },
      console.log('installment', bodyData)
    )
  }

  async getSubscriptionActivated(companyId) {
    const response = await SubscriptionModel.findOne({
      where: { companyId }
    })
    return response
  }
}

module.exports = new SubscriptionDomain()
