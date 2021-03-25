const request = require('supertest')
const app = require('../../index')
const factory = require('../../utils/helpers/factories')
const { fakerPlan } = require('../../utils/helpers/fakers')

describe('plan controller', () => {
  let token = null

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = response.body.token
  })
  describe('post plan', () => {
    it('create plan', async () => {
      expect.hasAssertions()
      const planMock = fakerPlan()

      const res = await request(app)
        .post('/api/plan')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(planMock)
      expect(res.statusCode).toBe(201)
      expect(res.request.method).toStrictEqual('POST')
      expect(res.body).toHaveProperty('activated', planMock.activated)
      expect(res.body).toHaveProperty('description', planMock.description)
      expect(res.body).toHaveProperty('discount', planMock.discount)
      expect(res.body).toHaveProperty(
        'quantityProduct',
        planMock.quantityProduct
      )
      expect(res.body).toHaveProperty('amount', planMock.amount)
    })

    describe('update plan controller', () => {
      let planFactory = null

      beforeAll(async () => {
        planFactory = await factory.create('plan')
      })

      it('update plan', async () => {
        expect.hasAssertions()
        const planMock = fakerPlan()

        const res = await request(app)
          .put(`/api/plan/${planFactory.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .send(planMock)
        expect(res.request.method).toStrictEqual('PUT')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('activated', planMock.activated)
        expect(res.body).toHaveProperty('description', planMock.description)
        expect(res.body).toHaveProperty('discount', planMock.discount)
        expect(res.body).toHaveProperty(
          'quantityProduct',
          planMock.quantityProduct
        )
        expect(res.body).toHaveProperty('amount', planMock.amount)
      })
    })

    describe('get plan controller', () => {
      it('get all plan', async () => {
        expect.hasAssertions()
        const res = await request(app)
          .get('/api/plan')
          .set('Authorization', `Bearer ${token}`)
        expect(res.request.method).toStrictEqual('GET')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('total', expect.any(Number))
        expect(res.body).toHaveProperty('source')
        expect(res.body.total).toBeGreaterThan(0)
        expect(res.body.source).toContainEqual(
          expect.objectContaining({
            id: expect.stringMatching(/^pl_/),
            activated: expect.any(Boolean),
            description: expect.any(String),
            discount: expect.any(String),
            quantityProduct: expect.any(Number),
            amount: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null
          })
        )
      })
    })
  })
})
