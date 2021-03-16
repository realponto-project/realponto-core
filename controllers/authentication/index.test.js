const request = require('supertest')
const app = require('../../index')

describe('authentication User', () => {
  describe('login', () => {
    it('should return a token', async () => {
      expect.hasAssertions()

      const response = await request(app).post('/auth/login').send({
        email: 'alexandre_santos@hotmail.com',
        password: '123456'
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    })
  })
})
