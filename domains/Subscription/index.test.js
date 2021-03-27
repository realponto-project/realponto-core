const SubscriptionDomain = require('.')
const { fakerSubscription } = require('../../utils/helpers/fakers')
const factory = require('../../utils/helpers/factories')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create subscription', () => {
  let plan = null

  beforeAll(async () => {
    plan = await factory.create('plan')
  })
  it('create new subscription', async () => {
    expect.hasAssertions()

    const subscriptionMock = fakerSubscription()
    const subscriptionCreated = await SubscriptionDomain.create({
      ...subscriptionMock,
      companyId,
      planId: plan.id
    })

    expect(subscriptionCreated).toHaveProperty('id')
    expect(subscriptionCreated.id).toMatch(/^sb_/)
    expect(subscriptionCreated).toHaveProperty(
      'activated',
      subscriptionMock.activated
    )
    expect(subscriptionCreated).toHaveProperty(
      'autoRenew',
      subscriptionMock.autoRenew
    )
    expect(subscriptionCreated).toHaveProperty(
      'paymentMethod',
      subscriptionMock.paymentMethod
    )
    expect(subscriptionCreated).toHaveProperty(
      'status',
      subscriptionMock.status
    )
    expect(subscriptionCreated).toHaveProperty(
      'amount',
      subscriptionMock.amount
    )
    expect(subscriptionCreated).toHaveProperty('tId', subscriptionMock.tId)
    expect(subscriptionCreated).toHaveProperty(
      'authorization_code',
      subscriptionMock.authorization_code
    )
    expect(subscriptionCreated).toHaveProperty('companyId', companyId)
  })
})
