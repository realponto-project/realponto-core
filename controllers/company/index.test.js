const request = require('supertest')
const app = require('../../index')
const faker = require('faker')
const truncate = require('../../utils/truncate')
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
    // afterAll(async () => await truncate())

    it('create company', async () => {
      expect.hasAssertions()
      const res = await request(app).post('/register').send(companyMock)
      expect(res.statusCode).toBe(201)
      expect(res.request.method).toStrictEqual('POST')
      expect(companyMock.company).toHaveProperty('name')
      expect(companyMock.company).toHaveProperty('fullname')
      expect(companyMock.company).toHaveProperty('document')
      expect(companyMock.company).toHaveProperty('siteUrl')
      expect(companyMock.company).toHaveProperty('allowOrder')
      expect(companyMock.company).toHaveProperty('allowPdv')
      expect(companyMock.user).toHaveProperty('name')
      expect(companyMock.user).toHaveProperty('email')
      expect(companyMock.user).toHaveProperty('password')
      expect(companyMock.user).toHaveProperty('birthday')
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

    it('update company', () => {
      const companiesMock = fakerCompany()

      const res = request(app)
        .put(`/api/companies/${companyFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(companiesMock)
      expect(res.method).toStrictEqual('PUT')
      expect(companiesMock).toHaveProperty('name')
      expect(companiesMock).toHaveProperty('fullname')
      expect(companiesMock).toHaveProperty('document')
      expect(companiesMock).toHaveProperty('siteUrl')
      expect(companiesMock).toHaveProperty('allowOrder')
      expect(companiesMock).toHaveProperty('allowPdv')
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

    it('get company by id', () => {
      const res = request(app)
        .get(`/api/companies/${companyFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.method).toStrictEqual('GET')
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

    it('get all company', () => {
      const res = request(app)
        .get('/api/companies')
        .set('Authorization', `Bearer ${token}`)
      expect(res.method).toStrictEqual('GET')
    })
  })
})
