const request = require('supertest')
const app = require('../../index')
const faker = require('faker')
const truncate = require('../../utils/truncate')

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
    afterAll(async () => await truncate())

    it('create company', async () => {
      expect.hasAssertions()
      const res = await request(app).post('/register').send(companyMock)
      expect(res.statusCode).toBe(201)
      expect(res.request.method).toStrictEqual('POST')
    })
  })

  // describe('get company by id', function (id) {
  // 	afterAll(async () => await truncate())

  //   it('responds with json', function (done) {
  // 		expect.hasAssertions()

  //     request(app)
  //       .get(`/api/companies/${id}`)
  //       .auth('username', 'password')
  //       .set('Accept', 'application/json')
  //       .expect('Content-Type', /json/)
  //       .expect(200, done)
  //   })
  // })
})
