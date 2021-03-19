const request = require('supertest')
const faker = require('faker')

const app = require('../../index')
const factory = require('../../utils/helpers/factories')
const { fakerCompany } = require('../../utils/helpers/fakers')

const companyMock = {
  company: {
    name: 'Company fullname ltda 123',
    fullname: 'Fullname company social name ltda',
    document: String(faker.random.number()),
    siteUrl: 'www.mycompany.com.br',
    allowOrder: true,
    allowPdv: false
  },
  user: {
    name: 'Alexandre Soares',
    email: `${faker.random.number()}@hotmail.com`,
    password: '123456',
    birthday: 'Mon Mar 15 2021 16:01:24 GMT-0300 (Horário Padrão de Brasília)'
  }
}

describe('company controller', () => {
  describe('post company', () => {
    it('create company', async () => {
      expect.hasAssertions()
      const res = await request(app).post('/register').send(companyMock)
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('name', companyMock.company.name)
      expect(res.body).toHaveProperty('fullname', companyMock.company.fullname)
      expect(res.body).toHaveProperty('document', companyMock.company.document)
      expect(res.body).toHaveProperty('siteUrl', companyMock.company.siteUrl)
      expect(res.body).toHaveProperty(
        'allowOrder',
        companyMock.company.allowOrder
      )
      expect(res.body).toHaveProperty('allowPdv', companyMock.company.allowPdv)
    })
  })

  describe('update company controller', () => {
    let token = null
    let companyFactory = null

    beforeAll(async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'alexandre_santos@hotmail.com',
        password: '123456'
      })

      token = response.body.token

      companyFactory = await factory.create('company')
    })

    it('update company', async () => {
      expect.hasAssertions()
      const companiesMock = fakerCompany()

      const res = await request(app)
        .put(`/api/companies/${companyFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(companiesMock)
      expect(res.request.method).toStrictEqual('PUT')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('name', companiesMock.name)
      expect(res.body).toHaveProperty('fullname', companiesMock.fullname)
      expect(res.body).toHaveProperty('document', companiesMock.document)
      expect(res.body).toHaveProperty('siteUrl', companiesMock.siteUrl)
      expect(res.body).toHaveProperty('allowOrder', companiesMock.allowOrder)
      expect(res.body).toHaveProperty('allowPdv', companiesMock.allowPdv)
    })
  })

  describe('get company controller', () => {
    let token = null
    let companyFactory = null

    beforeAll(async () => {
      companyFactory = await factory.create('company')
      const response = await request(app).post('/auth/login').send({
        email: 'alexandre_santos@hotmail.com',
        password: '123456'
      })

      token = response.body.token
    })

    it('get company by id', async () => {
      expect.hasAssertions()
      const res = await request(app)
        .get(`/api/companies/${companyFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.request.method).toStrictEqual('GET')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('name', companyFactory.name)
      expect(res.body).toHaveProperty('fullname', companyFactory.fullname)
      expect(res.body).toHaveProperty('document', companyFactory.document)
      expect(res.body).toHaveProperty('siteUrl', companyFactory.siteUrl)
      expect(res.body).toHaveProperty('allowOrder', companyFactory.allowOrder)
      expect(res.body).toHaveProperty('allowPdv', companyFactory.allowPdv)
    })
  })

  describe('get company controller', () => {
    let token = null
    let companyFactory = null

    beforeAll(async () => {
      companyFactory = await factory.create('company')

      const response = await request(app).post('/auth/login').send({
        email: 'alexandre_santos@hotmail.com',
        password: '123456'
      })

      token = response.body.token
    })

    it('get all company', async () => {
      expect.hasAssertions()
      const res = await request(app)
        .get('/api/companies')
        .set('Authorization', `Bearer ${token}`)
      expect(res.request.method).toStrictEqual('GET')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('total', expect.any(Number))
      expect(res.body).toHaveProperty('source')
      expect(res.body.total).toBeGreaterThan(0)
      expect(res.body.source).toContainEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^co_/),
          name: expect.any(String),
          fullname: expect.any(String),
          siteUrl: expect.any(String),
          document: expect.any(String),
          passwordUserDefault: expect.any(String),
          companyLogo: expect.any(String),
          trialDays: expect.any(Number),
          subscription: expect.any(Boolean),
          allowPdv: expect.any(Boolean),
          allowOrder: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null
        })
      )
    })
  })
})
