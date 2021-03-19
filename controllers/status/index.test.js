const request = require('supertest')
const app = require('../../index')
const factory = require('../../utils/helpers/factories')
const { fakerStatus } = require('../../utils/helpers/fakers')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('status controller', () => {
  let token = null
  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = response.body.token
  })
  describe('post status', () => {
    it('create status', async () => {
      expect.hasAssertions()
      const statusMock = fakerStatus()

      const res = await request(app)
        .post('/api/status')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(statusMock)
      expect(res.statusCode).toBe(201)
      expect(res.request.method).toStrictEqual('POST')
      expect(res.body).toHaveProperty('activated', statusMock.activated)
      expect(res.body).toHaveProperty('label', statusMock.label)
      expect(res.body).toHaveProperty('value', statusMock.value)
      expect(res.body).toHaveProperty('color', statusMock.color)
      expect(res.body).toHaveProperty('type', statusMock.type)
      expect(res.body).toHaveProperty('typeLabel', statusMock.typeLabel)
      expect(res.body).toHaveProperty('companyId', companyId)
    })
  })

  describe('update status controller', () => {
    let statusFactory = null

    beforeAll(async () => {
      statusFactory = await factory.create('status')
    })

    it('update status', async () => {
      expect.hasAssertions()
      const statusMock = fakerStatus()

      const res = await request(app)
        .put(`/api/status/${statusFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(statusMock)
      expect(res.request.method).toStrictEqual('PUT')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('activated', statusMock.activated)
      expect(res.body).toHaveProperty('label', statusMock.label)
      expect(res.body).toHaveProperty('value', statusMock.value)
      expect(res.body).toHaveProperty('color', statusMock.color)
      expect(res.body).toHaveProperty('type', statusMock.type)
      expect(res.body).toHaveProperty('typeLabel', statusMock.typeLabel)
      expect(res.body).toHaveProperty('companyId', companyId)
    })
  })

  describe('get status controller', () => {
    let statusFactory = null

    beforeAll(async () => {
      statusFactory = await factory.create('status')
    })

    it('get status by id', async () => {
      expect.hasAssertions()
      const res = await request(app)
        .get(`/api/status/${statusFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
      expect(res.request.method).toStrictEqual('GET')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('activated', statusFactory.activated)
      expect(res.body).toHaveProperty('label', statusFactory.label)
      expect(res.body).toHaveProperty('value', statusFactory.value)
      expect(res.body).toHaveProperty('color', statusFactory.color)
      expect(res.body).toHaveProperty('type', statusFactory.type)
      expect(res.body).toHaveProperty('typeLabel', statusFactory.typeLabel)
      expect(res.body).toHaveProperty('companyId', companyId)
    })
  })

  describe('get status controller', () => {
    let statusFactory = null

    beforeAll(async () => {
      statusFactory = await factory.create('status')
    })

    it('get all status', async () => {
      expect.hasAssertions()
      const res = await request(app)
        .get('/api/status')
        .set('Authorization', `Bearer ${token}`)
      expect(res.request.method).toStrictEqual('GET')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('total', expect.any(Number))
      expect(res.body).toHaveProperty('source')
      expect(res.body.total).toBeGreaterThan(0)
      expect(res.body.source).toContainEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^st_/),
          activated: expect.any(Boolean),
          label: expect.any(String),
          value: expect.any(String),
          color: expect.any(String),
          type: expect.any(String),
          typeLabel: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null
        })
      )
    })
  })
})
