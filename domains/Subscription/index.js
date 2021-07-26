const database = require('../../database')
const SubscriptionModel = database.model('subscription')
const PlanModel = database.model('plan')
const SubscriptionSchema = require('../../utils/helpers/Schemas/Subscription')
const moment = require('moment')

class SubscriptionDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    console.log('********* domain 1 *********')
    await SubscriptionSchema.validate(bodyData, { abortEarly: false })

    const searchPlanActivated = await PlanModel.findOne({
      where: { id: bodyData.planId, activated: true }
    })
    console.log('********* domain 2 *********')

    if (!searchPlanActivated) {
      throw new Error('Erro')
    }
    console.log('********* domain 3 *********')

    const response = await SubscriptionModel.create(
      {
        ...bodyData,
        endDate: moment().add(13, 'months')
      },
      { transaction }
    )
    console.log('********* domain 4 *********')
    return response
  }

  async getSubscriptionActivated(companyId) {
    const response = await SubscriptionModel.findOne({
      where: { companyId }
    })
    return response
  }
}

module.exports = new SubscriptionDomain()
