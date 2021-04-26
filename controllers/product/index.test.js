const request = require('supertest')
const app = require('../../index')
const factory = require('../../utils/helpers/factories')
const { fakerProduct } = require('../../utils/helpers/fakers')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('product controller', () => {
  let token = null

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = response.body.token
  })
  describe('post product', () => {
    it('create product', async () => {
      expect.hasAssertions()
      const productMock = fakerProduct()

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(productMock)
      expect(res.statusCode).toBe(201)
      expect(res.request.method).toStrictEqual('POST')
      expect(res.body).toHaveProperty('activated', productMock.activated)
      expect(res.body).toHaveProperty('balance', productMock.balance)
      expect(res.body).toHaveProperty('name', productMock.name)
      expect(res.body).toHaveProperty('barCode', productMock.barCode)
      expect(res.body).toHaveProperty('minQuantity', productMock.minQuantity)
      expect(res.body).toHaveProperty('buyPrice', productMock.buyPrice)
      expect(res.body).toHaveProperty('salePrice', productMock.salePrice)
      expect(res.body).toHaveProperty('companyId', companyId)
    })

    describe('update product controller', () => {
      let productFactory = null

      beforeAll(async () => {
        productFactory = await factory.create('product')
      })

      it('update product', async () => {
        expect.hasAssertions()
        const productMock = fakerProduct()

        const res = await request(app)
          .put(`/api/products/${productFactory.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .send(productMock)
        expect(res.request.method).toStrictEqual('PUT')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('activated', productMock.activated)
        expect(res.body).toHaveProperty('balance', productMock.balance)
        expect(res.body).toHaveProperty('name', productMock.name)
        expect(res.body).toHaveProperty('barCode', productMock.barCode)
        expect(res.body).toHaveProperty('minQuantity', productMock.minQuantity)
        expect(res.body).toHaveProperty('buyPrice', productMock.buyPrice)
        expect(res.body).toHaveProperty('salePrice', productMock.salePrice)
        expect(res.body).toHaveProperty('companyId', companyId)
      })
    })

    describe('get product controller', () => {
      let productFactory = null

      beforeAll(async () => {
        productFactory = await factory.create('product')
      })

      it('get product by id', async () => {
        expect.hasAssertions()
        const res = await request(app)
          .get(`/api/products/${productFactory.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
        expect(res.request.method).toStrictEqual('GET')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('activated', productFactory.activated)
        expect(res.body).toHaveProperty('balance', productFactory.balance)
        expect(res.body).toHaveProperty('name', productFactory.name)
        expect(res.body).toHaveProperty('barCode', productFactory.barCode)
        expect(res.body).toHaveProperty(
          'minQuantity',
          productFactory.minQuantity
        )
        expect(res.body).toHaveProperty('buyPrice', productFactory.buyPrice)
        expect(res.body).toHaveProperty('salePrice', productFactory.salePrice)
        expect(res.body).toHaveProperty('companyId', companyId)
      })
    })

    describe('get all product controller', () => {
      it('get all product', async () => {
        expect.hasAssertions()

        await factory.create('product')

        const res = await request(app)
          .get('/api/products')
          .set('Authorization', `Bearer ${token}`)
        expect(res.request.method).toStrictEqual('GET')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('total', expect.any(Number))
        expect(res.body).toHaveProperty('source')
        expect(res.body.source).toContainEqual(
          expect.objectContaining({
            id: expect.stringMatching(/^pr_/),
            activated: expect.any(Boolean),
            balance: expect.any(Number),
            name: expect.any(String),
            barCode: expect.any(String),
            minQuantity: expect.any(Number),
            buyPrice: expect.any(Number),
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
