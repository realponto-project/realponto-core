const request = require('supertest')
const app = require('../../index')
const { fakerSubscription } = require('../../utils/helpers/fakers')
const factory = require('../../utils/helpers/factories')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('subscription controller', () => {
  let token = null
  let plan = null

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = response.body.token

    plan = await factory.create('plan')
  })
  describe('post subscription', () => {
    it('create subscription', async () => {
      expect.hasAssertions()
      const subscriptionMock = { ...fakerSubscription(), planId: plan.id }

      const res = await request(app)
        .post('/api/subscription')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(subscriptionMock)
      expect(res.statusCode).toBe(201)
      expect(res.request.method).toStrictEqual('POST')
      expect(res.body).toHaveProperty('activated', subscriptionMock.activated)
      expect(res.body).toHaveProperty('startDate')
      expect(new Date(res.body.startDate)).toStrictEqual(
        subscriptionMock.startDate
      )
      expect(res.body).toHaveProperty('endDate')
      expect(new Date(res.body.endDate)).toStrictEqual(subscriptionMock.endDate)
      expect(res.body).toHaveProperty('autoRenew', subscriptionMock.autoRenew)
      expect(res.body).toHaveProperty(
        'paymentMethod',
        subscriptionMock.paymentMethod
      )
      expect(res.body).toHaveProperty(
        'statusPayment',
        subscriptionMock.statusPayment
      )
      expect(res.body).toHaveProperty('companyId', companyId)
    })
  })
})
