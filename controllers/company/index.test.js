const request = require('supertest')
const app = require('../../index')
const faker = require('faker')

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

describe.only('company controller', () => {
  describe('post company', () => {
    it('create company', async () => {
      expect.hasAssertions()
      const res = await request(app).post('/register').send(companyMock)
      expect(res.statusCode).toEqual(201)
      expect(res.method).toEqual('POST')
    })
  })
})
