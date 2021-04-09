const { prop } = require('ramda')
const { hash } = require('bcrypt')

const factory = require('../../utils/helpers/factories')
const userDomain = require('.')
const { generatorFakerUser } = require('../../utils/helpers/Faker/user')
const { NotFoundError } = require('../../utils/helpers/errors')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create User', () => {
  it('create new user', async () => {
    expect.hasAssertions()

    const userMock = generatorFakerUser()

    const userCreated = await userDomain.create({
      ...userMock,
      companyId
    })

    expect(userCreated).toHaveProperty('id')
    expect(userCreated.id).toMatch(/^us_/)
    expect(userCreated).toHaveProperty('activated', userMock.activated)
    expect(userCreated).toHaveProperty('name', userMock.name)
    expect(userCreated).toHaveProperty('email', userMock.email)
    expect(userCreated).toHaveProperty(
      'phone',
      userMock.phone.replace(/\D/g, '')
    )
    expect(userCreated).toHaveProperty('badget', userMock.badget)
    expect(userCreated).toHaveProperty('birthday', userMock.birthday)
    expect(userCreated).toHaveProperty('password')
    expect(userCreated).toHaveProperty('firstAccess', userMock.firstAccess)
    expect(userCreated).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
    expect(userCreated).toHaveProperty('company')
  })
})

describe('update User', () => {
  let userFactory = null

  beforeAll(async () => {
    userFactory = await factory.create('user')
  })

  it('update user', async () => {
    expect.hasAssertions()

    const userMock = generatorFakerUser()

    const userUpdated = await userDomain.update(userFactory.id, {
      ...userMock,
      companyId
    })

    expect(userUpdated).toHaveProperty('id', userFactory.id)
    expect(userUpdated).toHaveProperty('password')
    expect(userUpdated).toHaveProperty('activated', userMock.activated)
    expect(userUpdated).toHaveProperty('name', userMock.name)
    expect(userUpdated).toHaveProperty('email', userMock.email)
    expect(userUpdated).toHaveProperty(
      'phone',
      userMock.phone.replace(/\D/g, '')
    )
    expect(userUpdated).toHaveProperty('badget', userMock.badget)
    expect(userUpdated).toHaveProperty('birthday', userMock.birthday)
    expect(userUpdated).toHaveProperty('firstAccess', userMock.firstAccess)
    expect(userUpdated).toHaveProperty('companyId', companyId)
    expect(userUpdated).toHaveProperty('company')
  })
})
describe('update password', () => {
  let userFactory = null
  beforeAll(async () => {
    const password = await hash('123', 10)

    userFactory = await factory.create('user', {
      password,
      activated: true
    })
  })

  it('update password', async () => {
    expect.assertions(12)

    const newPassword = prop('password', generatorFakerUser())

    const userUpdated = await userDomain.updatePassword(userFactory.id, {
      companyId,
      password: '123',
      newPassword
    })

    expect(userUpdated).toHaveProperty('id', userFactory.id)
    expect(userUpdated).toHaveProperty('activated', true)
    expect(userUpdated).toHaveProperty('name', userFactory.name)
    expect(userUpdated).toHaveProperty('email', userFactory.email)
    expect(userUpdated).toHaveProperty(
      'phone',
      userFactory.phone.replace(/\D/g, '')
    )
    expect(userUpdated).toHaveProperty('badget', userFactory.badget)
    expect(userUpdated).toHaveProperty('birthday', userFactory.birthday)
    expect(userUpdated).toHaveProperty('firstAccess', userFactory.firstAccess)
    expect(userUpdated).toHaveProperty('companyId', companyId)
    expect(userUpdated).toHaveProperty('password')
    expect(await userUpdated.checkPassword('123')).toBeFalsy()
    expect(await userUpdated.checkPassword(newPassword)).toBeTruthy()
  })

  it('try update password with companyId invalid', async () => {
    expect.hasAssertions()

    const newPassword = prop('password', generatorFakerUser())

    await expect(
      userDomain.updatePassword(userFactory.id, {
        companyId: 'invalid',
        password: '123',
        newPassword
      })
    ).rejects.toThrow(new NotFoundError('user not found'))
  })

  it('try update password with password invalid', async () => {
    expect.hasAssertions()

    const newPassword = prop('password', generatorFakerUser())

    await expect(
      userDomain.updatePassword(userFactory.id, {
        companyId,
        password: 'invalid',
        newPassword
      })
    ).rejects.toThrow(new Error('Password do not match with password saved'))
  })
})

describe('getById user', () => {
  let userFactory = null
  beforeAll(async () => {
    userFactory = await factory.create('user')
  })

  it('get user by id', async () => {
    expect.assertions(11)

    const userFinded = await userDomain.getById(userFactory.id, companyId)

    expect(userFinded).toHaveProperty('id', userFactory.id)
    expect(userFinded).toHaveProperty('password')
    expect(userFinded).toHaveProperty('activated', userFactory.activated)
    expect(userFinded).toHaveProperty('name', userFactory.name)
    expect(userFinded).toHaveProperty('email', userFactory.email)
    expect(userFinded).toHaveProperty(
      'phone',
      userFactory.phone.replace(/\D/g, '')
    )
    expect(userFinded).toHaveProperty('badget', userFactory.badget)
    expect(userFinded).toHaveProperty('birthday', userFactory.birthday)
    expect(userFinded).toHaveProperty('firstAccess', userFactory.firstAccess)
    expect(userFinded).toHaveProperty('companyId', companyId)
    expect(userFinded).toHaveProperty('company')
  })
})

describe('getAll user', () => {
  beforeAll(async () => {
    await factory.create('user')
  })

  it('get all user without query', async () => {
    expect.hasAssertions()

    const usersFinded = await userDomain.getAll({}, companyId)

    expect(usersFinded).toHaveProperty('count')
    expect(usersFinded.count).toBeGreaterThan(0)
    expect(usersFinded).toHaveProperty('rows')
  })
})
