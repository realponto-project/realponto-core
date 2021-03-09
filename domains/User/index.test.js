const { prop } = require('ramda')
const userDomain = require('.')
// const { generatorFakerCustomer } = require('../../utils/helpers/Faker/customer')
const { generatorFakerUser } = require('../../utils/helpers/Faker/user')
const { NotFoundError } = require('../../utils/helpers/errors')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create User', () => {
  it('create new user', async () => {
    expect.assertions(12)

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
    expect(userCreated).toHaveProperty('phone', userMock.phone)
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
  let user = null
  beforeAll(async () => {
    user = await userDomain.create({
      ...generatorFakerUser(),
      companyId
    })
  })

  it('update user', async () => {
    expect.assertions(11)

    const userMock = generatorFakerUser()

    const userUpdated = await userDomain.update(user.id, companyId, {
      ...userMock,
      companyId
    })

    expect(userUpdated).toHaveProperty('id', user.id)
    expect(userUpdated).toHaveProperty('password')
    expect(userUpdated).toHaveProperty('activated', userMock.activated)
    expect(userUpdated).toHaveProperty('name', userMock.name)
    expect(userUpdated).toHaveProperty('email', userMock.email)
    expect(userUpdated).toHaveProperty('phone', userMock.phone)
    expect(userUpdated).toHaveProperty('badget', userMock.badget)
    expect(userUpdated).toHaveProperty('birthday', userMock.birthday)
    expect(userUpdated).toHaveProperty('firstAccess', userMock.firstAccess)
    expect(userUpdated).toHaveProperty('companyId', companyId)
    expect(userUpdated).toHaveProperty('company')
  })
})
describe('update password', () => {
  let user = null
  let userMock = null
  beforeAll(async () => {
    userMock = generatorFakerUser()
    user = await userDomain.create({
      ...userMock,
      activated: true,
      companyId
    })
  })

  it('update password', async () => {
    expect.assertions(13)

    const newPassword = prop('password', generatorFakerUser())

    const userUpdated = await userDomain.updatePassword(user.id, companyId, {
      password: prop('password', userMock),
      newPassword
    })

    expect(userUpdated).toHaveProperty('id', user.id)
    expect(userUpdated).toHaveProperty('activated', true)
    expect(userUpdated).toHaveProperty('name', userMock.name)
    expect(userUpdated).toHaveProperty('email', userMock.email)
    expect(userUpdated).toHaveProperty('phone', userMock.phone)
    expect(userUpdated).toHaveProperty('badget', userMock.badget)
    expect(userUpdated).toHaveProperty('birthday', userMock.birthday)
    expect(userUpdated).toHaveProperty('firstAccess', userMock.firstAccess)
    expect(userUpdated).toHaveProperty('companyId', companyId)
    expect(userUpdated).toHaveProperty('company')
    expect(userUpdated).toHaveProperty('password')
    expect(
      await userUpdated.checkPassword(prop('password', userMock))
    ).toBeFalsy()
    expect(await userUpdated.checkPassword(newPassword)).toBeTruthy()
  })

  it('try update password with companyId invalid', async () => {
    expect.assertions(1)

    const newPassword = prop('password', generatorFakerUser())

    await expect(
      userDomain.updatePassword(user.id, 'invalid', {
        password: prop('password', userMock),
        newPassword
      })
    ).rejects.toThrow(new NotFoundError('user not found'))
  })

  it('try update password without newPassword', async () => {
    expect.assertions(1)

    await expect(
      userDomain.updatePassword(user.id, companyId, {
        password: prop('password', userMock)
      })
    ).rejects.toThrow(new NotFoundError('newPassword is a required field'))
  })

  it('try update password with password invalid', async () => {
    expect.assertions(1)

    const newPassword = prop('password', generatorFakerUser())

    await expect(
      userDomain.updatePassword(user.id, companyId, {
        password: 'invalid',
        newPassword
      })
    ).rejects.toThrow(new Error('Password do not match with password saved'))
  })
})
describe('getById user', () => {
  let user = null
  beforeAll(async () => {
    user = await userDomain.create({
      ...generatorFakerUser(),
      companyId
    })
  })

  it('get user by id', async () => {
    expect.assertions(12)

    const userFinded = await userDomain.getById(user.id, companyId)

    expect(userFinded).toHaveProperty('id', user.id)
    expect(userFinded).toHaveProperty('password')
    expect(userFinded).toHaveProperty('activated', user.activated)
    expect(userFinded).toHaveProperty('name', user.name)
    expect(userFinded).toHaveProperty('email', user.email)
    expect(userFinded).toHaveProperty('phone', user.phone)
    expect(userFinded).toHaveProperty('badget', user.badget)
    expect(userFinded).toHaveProperty('birthday', user.birthday)
    expect(userFinded).toHaveProperty('firstAccess', user.firstAccess)
    expect(userFinded).toHaveProperty('companyId', companyId)
    expect(userFinded).toHaveProperty('company')
    expect(userFinded.company).toStrictEqual(user.company)
  })
})

describe('getAll user', () => {
  beforeAll(async () => {
    await userDomain.create({
      ...generatorFakerUser(),
      companyId
    })
  })

  it('get all user without query', async () => {
    expect.assertions(3)

    const usersFinded = await userDomain.getAll({}, companyId)

    expect(usersFinded).toHaveProperty('count')
    expect(usersFinded.count).toBeGreaterThan(1)
    expect(usersFinded).toHaveProperty('rows')
  })
})
