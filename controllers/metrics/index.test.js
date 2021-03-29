const request = require('supertest')

const app = require('../../index')

describe('controller Metrics', () => {
  let token = null
  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = body.token
  })

  it('should get metrics to home basic dash', async () => {
    expect.assertions(2)
    await request(app)
      .get('/api/summary-home-basic')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customers: { value: 1234 },
        orders: { value: 3 },
        ordersTotal: [{
          name: '01/03/2021',
          resumeDate: '01',
          total: 10
        },
        {
          name: '02/03/2021',
          resumeDate: '02',
          total: 20
        },
        {
          name: '03/03/2021',
          resumeDate: '03',
          total: 1
        }],
        ordersToday: [{
          name: 'Vendas',
          value: 1
        }]
      })

    expect(response).toHaveProperty('status', 200)
    expect(response.request).toHaveProperty('method', 'GET')
  })
})
