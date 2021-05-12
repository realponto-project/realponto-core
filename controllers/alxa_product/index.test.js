const request = require('supertest')
const app = require('../../index')
const factory = require('../../utils/helpers/factories')
const { fakerAlxaProduct } = require('../../utils/helpers/fakers')

describe('alxa product controller', () => {
  let token = null

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = response.body.token
  })
  describe('alxa post product', () => {
    it('create alxa product', async () => {
      expect.hasAssertions()
      const productMock = fakerAlxaProduct()

      const res = await request(app)
        .post('/api/alxaProducts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(productMock)
      expect(res.statusCode).toBe(201)
      expect(res.request.method).toStrictEqual('POST')
      expect(res.body).toHaveProperty('activated', productMock.activated)
      expect(res.body).toHaveProperty('name', productMock.name)
      expect(res.body).toHaveProperty('salePrice', productMock.salePrice)
      expect(res.body).toHaveProperty('type', productMock.type)
    })

    describe('update alxa product controller', () => {
      let productFactory = null

      beforeAll(async () => {
        productFactory = await factory.create('alxa_product')
      })

      it('update alxa product', async () => {
        expect.hasAssertions()
        const productMock = fakerAlxaProduct()

        const res = await request(app)
          .put(`/api/alxaProducts/${productFactory.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .send(productMock)
        expect(res.request.method).toStrictEqual('PUT')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('activated', productMock.activated)
        expect(res.body).toHaveProperty('name', productMock.name)
        expect(res.body).toHaveProperty('salePrice', productMock.salePrice)
        expect(res.body).toHaveProperty('type', productMock.type)
      })
    })

    describe('get alxa product controller', () => {
      let productFactory = null

      beforeAll(async () => {
        productFactory = await factory.create('alxa_product')
      })

      it('get alxa product by id', async () => {
        expect.hasAssertions()
        const res = await request(app)
          .get(`/api/alxaProducts/${productFactory.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
        expect(res.request.method).toStrictEqual('GET')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('activated', productFactory.activated)
        expect(res.body).toHaveProperty('name', productFactory.name)
        expect(res.body).toHaveProperty('salePrice', productFactory.salePrice)
        expect(res.body).toHaveProperty('type', productFactory.type)
      })
    })

    describe('get all alxa product controller', () => {
      it('get all alxa product', async () => {
        expect.hasAssertions()

        await factory.create('alxa_product')

        const res = await request(app)
          .get('/api/alxaProducts')
          .set('Authorization', `Bearer ${token}`)
        expect(res.request.method).toStrictEqual('GET')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('total', expect.any(Number))
        expect(res.body).toHaveProperty('source')
        expect(res.body.source).toContainEqual(
          expect.objectContaining({
            id: expect.stringMatching(/^axpr_/),
            activated: expect.any(Boolean),
            name: expect.any(String),
            type: expect.any(String),
            salePrice: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null
          })
        )
      })
    })
  })
})
