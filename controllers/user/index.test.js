const request = require('supertest')
const { compareSync, hash } = require('bcrypt')

const app = require('../../index')
const factory = require('../../utils/helpers/factories')
const { generatorFakerUser } = require('../../utils/helpers/Faker/user')

describe('controller User', () => {
  let token = null

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'alexandre_santos@hotmail.com',
      password: '123456'
    })

    token = response.body.token
  })

  describe('create User', () => {
    it('should create with userMock', async () => {
      expect.hasAssertions()
      const userMock = generatorFakerUser()

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(userMock)

      expect(response.status).toBe(201)
      expect(response.request.method).toBe('POST')
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).toMatch(/^us_/)
      expect(response.body).toHaveProperty('activated', userMock.activated)
      expect(response.body).toHaveProperty('name', userMock.name)
      expect(response.body).toHaveProperty('email', userMock.email)
      expect(response.body).toHaveProperty(
        'phone',
        userMock.phone.replace(/\D/g, '')
      )
      expect(response.body).toHaveProperty('badget', userMock.badget)
      expect(response.body).toHaveProperty('birthday')
      expect(new Date(response.body.birthday)).toStrictEqual(userMock.birthday)
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty('firstAccess', userMock.firstAccess)
      expect(response.body).toHaveProperty(
        'companyId',
        'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      )
      expect(response.body).toHaveProperty('company')
      expect(response.body.company).toHaveProperty(
        'id',
        'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      )
      expect(response.body.company).toHaveProperty('name')
      expect(response.body.company).toHaveProperty('fullname')
      expect(response.body.company).toHaveProperty('siteUrl')
      expect(response.body.company).toHaveProperty('document')
      expect(response.body.company).toHaveProperty('passwordUserDefault')
      expect(response.body.company).toHaveProperty('companyLogo')
      expect(response.body.company).toHaveProperty('trialDays')
      expect(response.body.company).toHaveProperty('allowPdv')
      expect(response.body.company).toHaveProperty('allowOrder')
    })

    it('should return status code 403 to request without token', async () => {
      expect.hasAssertions()

      const userMock = generatorFakerUser()

      const response = await request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(userMock)

      expect(response.status).toBe(403)
    })

    it('should return status code 400 when request not sended body data', async () => {
      expect.hasAssertions()

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response.status).toBe(400)
    })
  })

  describe('update User', () => {
    let userFactory = null
    beforeAll(async () => {
      userFactory = await factory.create('user')
    })

    it('should update with userMock', async () => {
      expect.hasAssertions()

      const userMock = generatorFakerUser()

      const response = await request(app)
        .put(`/api/users/${userFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(userMock)

      expect(response.status).toBe(200)
      expect(response.request.method).toBe('PUT')
      expect(response.body).toHaveProperty('id', userFactory.id)
      expect(response.body).toHaveProperty('activated', userMock.activated)
      expect(response.body).toHaveProperty('name', userMock.name)
      expect(response.body).toHaveProperty('email', userMock.email)
      expect(response.body).toHaveProperty(
        'phone',
        userMock.phone.replace(/\D/g, '')
      )
      expect(response.body).toHaveProperty('badget', userMock.badget)
      expect(response.body).toHaveProperty('birthday')
      expect(new Date(response.body.birthday)).toStrictEqual(userMock.birthday)
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty('firstAccess', userMock.firstAccess)
      expect(response.body).toHaveProperty(
        'companyId',
        'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      )
      expect(response.body).toHaveProperty('company')
      expect(response.body.company).toHaveProperty(
        'id',
        'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      )
      expect(response.body.company).toHaveProperty('name')
      expect(response.body.company).toHaveProperty('fullname')
      expect(response.body.company).toHaveProperty('siteUrl')
      expect(response.body.company).toHaveProperty('document')
      expect(response.body.company).toHaveProperty('passwordUserDefault')
      expect(response.body.company).toHaveProperty('companyLogo')
      expect(response.body.company).toHaveProperty('trialDays')
      expect(response.body.company).toHaveProperty('allowPdv')
      expect(response.body.company).toHaveProperty('allowOrder')
    })

    it('should return status code 404 when request not sended Id params', async () => {
      expect.hasAssertions()

      const userMock = generatorFakerUser()

      const response = await request(app)
        .put('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(userMock)

      expect(response.status).toBe(404)
    })
    it('should return status code 400 when request sended email already existing', async () => {
      expect.hasAssertions()

      const { email } = await factory.create('user')

      const response = await request(app)
        .put(`/api/users/${userFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ email })

      expect(response.status).toBe(400)
    })
  })

  describe('get user by id', () => {
    let userFactory = null
    beforeAll(async () => {
      userFactory = await factory.create('user')
    })

    it('should get with userFactory.id', async () => {
      expect.hasAssertions()

      const userMock = generatorFakerUser()

      const response = await request(app)
        .get(`/api/users/${userFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(userMock)

      expect(response.status).toBe(200)
      expect(response.request.method).toBe('GET')
      expect(response.body).toHaveProperty('id', userFactory.id)
      expect(response.body).toHaveProperty('activated', userFactory.activated)
      expect(response.body).toHaveProperty('name', userFactory.name)
      expect(response.body).toHaveProperty('email', userFactory.email)
      expect(response.body).toHaveProperty(
        'phone',
        userFactory.phone.replace(/\D/g, '')
      )
      expect(response.body).toHaveProperty('badget', userFactory.badget)
      expect(response.body).toHaveProperty('birthday')
      expect(new Date(response.body.birthday)).toStrictEqual(
        userFactory.birthday
      )
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty(
        'firstAccess',
        userFactory.firstAccess
      )
      expect(response.body).toHaveProperty(
        'companyId',
        'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      )
      expect(response.body).toHaveProperty('company')
      expect(response.body.company).toHaveProperty(
        'id',
        'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      )
      expect(response.body.company).toHaveProperty('name')
      expect(response.body.company).toHaveProperty('fullname')
      expect(response.body.company).toHaveProperty('siteUrl')
      expect(response.body.company).toHaveProperty('document')
      expect(response.body.company).toHaveProperty('passwordUserDefault')
      expect(response.body.company).toHaveProperty('companyLogo')
      expect(response.body.company).toHaveProperty('trialDays')
      expect(response.body.company).toHaveProperty('allowPdv')
      expect(response.body.company).toHaveProperty('allowOrder')
    })

    it('should return null when request not sended Id params', async () => {
      expect.hasAssertions()

      const response = await request(app)
        .get(`/api/users/${123}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response.status).toBe(200)
      expect(response.body).toBeNull()
    })
  })

  describe('get all user', () => {
    it('should get all user', async () => {
      expect.assertions(5)
      const userMock = generatorFakerUser()

      const response = await request(app)
        .get(`/api/users`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(userMock)

      expect(response.status).toBe(200)
      expect(response.request.method).toBe('GET')
      expect(response.body).toHaveProperty('total', expect.any(Number))
      expect(response.body).toHaveProperty('source')
      expect(response.body.source).toContainEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^us_/),
          activated: expect.any(Boolean),
          name: expect.any(String),
          email: expect.stringMatching(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
          phone: expect.any(String),
          badget: expect.any(String),
          birthday: expect.any(String),
          document: expect.any(String),
          password: expect.any(String),
          firstAccess: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
        })
      )
    })
  })

  describe('update Password', () => {
    let token = null
    let userFactory = null

    beforeAll(async () => {
      userFactory = await factory.create('user', {
        activated: true,
        password: await hash('12345', 10)
      })

      const response = await request(app).post('/auth/login').send({
        email: userFactory.email,
        password: '12345'
      })

      token = response.body.token
    })

    it('should update with userMock', async () => {
      expect.assertions(14)

      const response = await request(app)
        .put(`/api/users-update-password`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          password: '12345',
          newPassword: '123'
        })
      expect(response.status).toBe(200)
      expect(response.request.method).toBe('PUT')
      expect(response.body).toHaveProperty('id', userFactory.id)
      expect(response.body).toHaveProperty('activated', userFactory.activated)
      expect(response.body).toHaveProperty('name', userFactory.name)
      expect(response.body).toHaveProperty('email', userFactory.email)
      expect(response.body).toHaveProperty(
        'phone',
        userFactory.phone.replace(/\D/g, '')
      )
      expect(response.body).toHaveProperty('badget', userFactory.badget)
      expect(response.body).toHaveProperty('birthday')
      expect(new Date(response.body.birthday)).toStrictEqual(
        userFactory.birthday
      )
      expect(response.body).toHaveProperty('password')
      expect(compareSync('123', response.body.password)).toBe(true)
      expect(response.body).toHaveProperty(
        'firstAccess',
        userFactory.firstAccess
      )
      expect(response.body).toHaveProperty(
        'companyId',
        'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      )
    })

    it('should return status code 400 when request sended invalid password', async () => {
      expect.hasAssertions()

      const response = await request(app)
        .put(`/api/users-update-password`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          password: 'invalid123',
          newPassword: 'valid 123'
        })

      expect(response.status).toBe(400)
    })
  })
})
