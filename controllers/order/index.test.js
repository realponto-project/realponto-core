const request = require('supertest')

const app = require('../../index')
const factory = require('../../utils/helpers/factories')

describe('controller Order', () => {
  let token = null
  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = response.body.token
  })

  describe('create', () => {
    it('should be able create order', async () => {
      expect.assertions(3)

      const statusFactory = await factory.create('status', { type: 'inputs' })
      const customerFactory = await factory.create('customer')
      const userFactory = await factory.create('user')
      const productsFactory = await factory.createMany('product', 3)

      const products = productsFactory.map(({ id: productId }) => ({
        productId,
        quantity: 10,
        price: 0
      }))

      const order = {
        statusId: statusFactory.id,
        customerId: customerFactory.id,
        userId: userFactory.id,
        products,
        originType: 'order'
      }

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(order)

      expect(response).toHaveProperty('status', 201)
      expect(response.request).toHaveProperty('method', 'POST')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          id: expect.stringMatching(/^or_/),
          pendingReview: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          customerId: customerFactory.id,
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          userId: userFactory.id,
          statusId: statusFactory.id,
          transactions: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^td_/),
              quantity: 10,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              deletedAt: null,
              productId: expect.stringMatching(/^pr_/),
              orderId: response.body.id,
              userId: userFactory.id,
              statusId: statusFactory.id,
              companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
            })
          ])
        })
      )
    })

    it('should be not able create order without statusId', async () => {
      expect.assertions(2)

      const customerFactory = await factory.create('customer')
      const userFactory = await factory.create('user')
      const productsFactory = await factory.createMany('product', 3)

      const products = productsFactory.map(({ id: productId }) => ({
        productId,
        quantity: 10
      }))

      const order = {
        customerId: customerFactory.id,
        userId: userFactory.id,
        products
      }

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(order)

      expect(response).toHaveProperty('status', 400)
      expect(response.request).toHaveProperty('method', 'POST')
    })
  })

  describe('get by id', () => {
    let orderFactory = null

    beforeAll(async () => {
      orderFactory = await factory.create('order')

      await factory.create('transaction', {
        orderId: orderFactory.id,
        statusId: orderFactory.statusId,
        userId: orderFactory.userId
      })
    })

    it('should be able find order by id', async () => {
      expect.assertions(3)

      const response = await request(app)
        .get(`/api/orders/${orderFactory.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveProperty('status', 200)
      expect(response.request).toHaveProperty('method', 'GET')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          id: orderFactory.id,
          pendingReview: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          customerId: orderFactory.customerId,
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          userId: orderFactory.userId,
          statusId: orderFactory.statusId,
          transactions: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^td_/),
              quantity: 10,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              deletedAt: null,
              productId: expect.stringMatching(/^pr_/),
              orderId: orderFactory.id,
              userId: orderFactory.userId,
              statusId: orderFactory.statusId,
              companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
            })
          ])
        })
      )
    })
  })

  describe('get All Order', () => {
    beforeAll(async () => {
      await factory.create('order')
    })

    it('should be get all order', async () => {
      expect.assertions(4)

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveProperty('status', 200)
      expect(response.request).toHaveProperty('method', 'GET')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          total: expect.any(Number),
          source: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^or_/),
              pendingReview: false,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              deletedAt: null,
              companyId: expect.stringMatching(/^co_/),
              statusId: expect.stringMatching(/^st_/)
            })
          ])
        })
      )
      expect(response.body.total).toBeGreaterThan(0)
    })
  })
})
