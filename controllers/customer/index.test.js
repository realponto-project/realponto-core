const request = require('supertest')

const app = require('../../index')
const factory = require('../../utils/helpers/factories')
const { generatorFakerAddress } = require('../../utils/helpers/Faker/address')
const { generatorFakerCustomer } = require('../../utils/helpers/Faker/customer')

describe('controller Customer', () => {
  let token = null
  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = body.token
  })
  describe('create customer', () => {
    it('should create customer without address', async () => {
      expect.hasAssertions()
      const customerMock = generatorFakerCustomer()

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .send(customerMock)

      expect(response).toHaveProperty('status', 201)
      expect(response.request).toHaveProperty('method', 'POST')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          id: expect.stringMatching(/^cu_/),
          name: customerMock.name,
          socialName: customerMock.socialName,
          document: customerMock.document,
          phone: customerMock.phone,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          addressId: null,
          address: null,
          company: expect.objectContaining({
            id: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
          })
        })
      )
    })

    it('should create customer with address', async () => {
      expect.hasAssertions()
      const customerMock = generatorFakerCustomer()
      const addressMock = generatorFakerAddress()

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...customerMock,
          address: addressMock
        })

      expect(response).toHaveProperty('status', 201)
      expect(response.request).toHaveProperty('method', 'POST')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          id: expect.stringMatching(/^cu_/),
          name: customerMock.name,
          socialName: customerMock.socialName,
          document: customerMock.document,
          phone: customerMock.phone,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          addressId: expect.stringMatching(/^ad_/),
          address: expect.objectContaining({
            id: expect.stringMatching(/^ad_/),
            neighborhood: addressMock.neighborhood,
            street: addressMock.street,
            streetNumber: addressMock.streetNumber,
            city: addressMock.city,
            states: addressMock.states,
            zipcode: addressMock.zipcode,
            complementary: addressMock.complementary,
            reference: addressMock.reference,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null
          }),
          company: expect.objectContaining({
            id: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
          })
        })
      )
    })

    it('should be not able create customer when not sended customer', async () => {
      expect.hasAssertions()

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveProperty('status', 400)
      expect(response.request).toHaveProperty('method', 'POST')
    })
  })

  describe('update customer', () => {
    let customerFactory = null
    beforeAll(async () => {
      customerFactory = await factory.create('customer')
    })

    it('should update customer', async () => {
      expect.hasAssertions()
      const customerMock = generatorFakerCustomer()
      const addressMock = generatorFakerAddress()

      const response = await request(app)
        .put(`/api/customers/${customerFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...customerMock, address: addressMock })

      expect(response).toHaveProperty('status', 200)
      expect(response.request).toHaveProperty('method', 'PUT')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          id: expect.stringMatching(/^cu_/),
          name: customerMock.name,
          socialName: customerMock.socialName,
          document: customerMock.document,
          phone: customerMock.phone,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          addressId: customerFactory.addressId,
          address: expect.objectContaining({
            id: customerFactory.addressId,
            neighborhood: addressMock.neighborhood,
            street: addressMock.street,
            streetNumber: addressMock.streetNumber,
            city: addressMock.city,
            states: addressMock.states,
            zipcode: addressMock.zipcode,
            complementary: addressMock.complementary,
            reference: addressMock.reference,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null
          }),
          company: expect.objectContaining({
            id: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
          })
        })
      )
    })

    it('should be not able create with invalid id', async () => {
      expect.hasAssertions()
      const customerMock = generatorFakerCustomer()

      const response = await request(app)
        .put(`/api/customers/${123}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...customerMock })

      expect(response).toHaveProperty('status', 400)
      expect(response.request).toHaveProperty('method', 'PUT')
    })
  })

  describe('get customer by id', () => {
    let customerFactory = null
    beforeAll(async () => {
      customerFactory = await factory.create('customer')
    })

    it('should return customer', async () => {
      expect.hasAssertions()

      const response = await request(app)
        .get(`/api/customers/${customerFactory.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveProperty('status', 200)
      expect(response.request).toHaveProperty('method', 'GET')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          id: expect.stringMatching(/^cu_/),
          name: customerFactory.name,
          socialName: customerFactory.socialName,
          document: customerFactory.document,
          phone: customerFactory.phone,
          deletedAt: null,
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          addressId: customerFactory.addressId,
          address: expect.objectContaining({
            id: customerFactory.addressId
          }),
          company: expect.objectContaining({
            id: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
          })
        })
      )
    })

    it('should return object empty when sended invalid id', async () => {
      expect.hasAssertions()

      const response = await request(app)
        .get(`/api/customers/${123}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveProperty('status', 200)
      expect(response.request).toHaveProperty('method', 'GET')
      expect(response).toHaveProperty('body', {})
    })
  })

  describe('get All Customer', () => {
    beforeAll(async () => {
      await factory.create('customer')
    })

    it('should retorn total and source', async () => {
      // expect.assertions(3)
      expect.hasAssertions()

      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${token}`)

      const sourceExpected = {
        id: expect.stringMatching(/^cu_/),
        name: expect.any(String),
        socialName: expect.any(String),
        document: expect.any(String),
        phone: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
        companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      }

      expect(response).toHaveProperty('status', 200)
      expect(response.request).toHaveProperty('method', 'GET')
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          total: expect.any(Number),
          source: expect.arrayContaining([
            expect.objectContaining({ ...sourceExpected, addressId: null }),
            expect.objectContaining({
              ...sourceExpected,
              addressId: expect.stringMatching(/^ad_/)
            })
          ])
        })
      )
      expect(response.body.total).toBeGreaterThan(0)
    })
  })
})
