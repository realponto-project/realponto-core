const orderDomain = require('.')
const StatusDomain = require('../status')
const customerDomain = require('../Customer')
const userDomain = require('../User')

const { fakerStatus } = require('../../utils/helpers/fakers')
const { generatorFakerCustomer } = require('../../utils/helpers/Faker/customer')
const { generatorFakerUser } = require('../../utils/helpers/Faker/user')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
describe('create Order', () => {
  let statusCreated = null
  let customerCreated = null
  let userCreated = null
  beforeAll(async () => {
    statusCreated = await StatusDomain.create({
      ...fakerStatus(),
      companyId
    })

    customerCreated = await customerDomain.create({
      ...generatorFakerCustomer(),
      companyId
    })

    userCreated = await userDomain.create({
      ...generatorFakerUser(),
      companyId
    })
  })
  it('new order', async () => {
    expect.assertions(7)

    const order = {
      statusId: statusCreated.id,
      customerId: customerCreated.id,
      userId: userCreated.id
    }

    const orderCreated = await orderDomain.create(companyId, order)

    expect(orderCreated).toHaveProperty('id')
    expect(orderCreated.id).toMatch(/^or_/)
    expect(orderCreated).toHaveProperty('companyId', companyId)
    expect(orderCreated).toHaveProperty('statusId', statusCreated.id)
    expect(orderCreated).toHaveProperty('customerId', customerCreated.id)
    expect(orderCreated).toHaveProperty('userId', userCreated.id)
    expect(orderCreated).toHaveProperty(
      'pendingReview',
      statusCreated.fakeTransaction
    )
  })

  it('try create order without companyId', async () => {
    expect.assertions(1)

    const order = {
      statusId: statusCreated.id,
      customerId: customerCreated.id,
      userId: userCreated.id
    }

    await expect(orderDomain.create(undefined, order)).rejects.toThrow(
      new Error('company not found')
    )
  })

  it('try create order other companyId', async () => {
    expect.assertions(1)

    const order = {
      statusId: statusCreated.id,
      customerId: customerCreated.id,
      userId: userCreated.id
    }

    await expect(
      orderDomain.create('co_5eb458ca-3466-4c89-99d2-e9ae57c0c362', order)
    ).rejects.toThrow(new Error('status not found or not belongs to company'))
  })

  it('try create order without statusId', async () => {
    expect.assertions(1)

    const order = {
      customerId: customerCreated.id,
      userId: userCreated.id
    }

    await expect(
      orderDomain.create('co_5eb458ca-3466-4c89-99d2-e9ae57c0c362', order)
    ).rejects.toThrow(new Error('status not found or not belongs to company'))
  })

  it('create order without userId and customerId', async () => {
    expect.assertions(7)

    const order = {
      statusId: statusCreated.id
    }

    const orderCreated = await orderDomain.create(companyId, order)

    expect(orderCreated).toHaveProperty('id')
    expect(orderCreated.id).toMatch(/^or_/)
    expect(orderCreated).toHaveProperty('companyId', companyId)
    expect(orderCreated).toHaveProperty('statusId', statusCreated.id)
    expect(orderCreated).toHaveProperty('customerId', null)
    expect(orderCreated).toHaveProperty('userId', null)
    expect(orderCreated).toHaveProperty(
      'pendingReview',
      statusCreated.fakeTransaction
    )
  })
})

describe('getById Order', () => {
  let orderCreated = null
  const statusMock = fakerStatus()
  const customerMock = generatorFakerCustomer()
  const userMock = generatorFakerUser()

  beforeAll(async () => {
    const statusCreated = await StatusDomain.create({
      ...statusMock,
      companyId
    })

    const customerCreated = await customerDomain.create({
      ...customerMock,
      companyId
    })

    const userCreated = await userDomain.create({
      ...userMock,
      companyId
    })

    const order = {
      statusId: statusCreated.id,
      customerId: customerCreated.id,
      userId: userCreated.id
    }

    orderCreated = await orderDomain.create(companyId, order)
  })

  it('get order by id', async () => {
    expect.assertions(33)

    const orderfinded = await orderDomain.getById(orderCreated.id, companyId)

    expect(orderfinded).toHaveProperty('id')
    expect(orderfinded.id).toMatch(/^or_/)
    expect(orderfinded).toHaveProperty('companyId', companyId)
    expect(orderfinded).toHaveProperty('statusId', orderCreated.statusId)
    expect(orderfinded).toHaveProperty('customerId', orderCreated.customerId)
    expect(orderfinded).toHaveProperty('userId', orderCreated.userId)
    expect(orderfinded).toHaveProperty(
      'pendingReview',
      orderfinded.status.fakeTransaction
    )

    expect(orderfinded.status).toHaveProperty('id', orderCreated.statusId)
    expect(orderfinded.status.id).toMatch(/^st_/)
    expect(orderfinded.status).toHaveProperty('activated', statusMock.activated)
    expect(orderfinded.status).toHaveProperty('label', statusMock.label)
    expect(orderfinded.status).toHaveProperty('value', statusMock.value)
    expect(orderfinded.status).toHaveProperty('color', statusMock.color)
    expect(orderfinded.status).toHaveProperty('type', statusMock.type)
    expect(orderfinded.status).toHaveProperty('typeLabel', statusMock.typeLabel)
    expect(orderfinded.status).toHaveProperty(
      'fakeTransaction',
      statusMock.fakeTransaction
    )

    expect(orderfinded.customer).toHaveProperty('id', orderCreated.customerId)
    expect(orderfinded.customer.id).toMatch(/^cu_/)
    expect(orderfinded.customer).toHaveProperty('name', customerMock.name)
    expect(orderfinded.customer).toHaveProperty(
      'socialName',
      customerMock.socialName
    )
    expect(orderfinded.customer).toHaveProperty(
      'document',
      customerMock.document
    )
    expect(orderfinded.customer).toHaveProperty('phone', customerMock.phone)

    expect(orderfinded.user).toHaveProperty('id', orderCreated.userId)
    expect(orderfinded.user.id).toMatch(/^us_/)
    expect(orderfinded.user).toHaveProperty('activated', userMock.activated)
    expect(orderfinded.user).toHaveProperty('name', userMock.name)
    expect(orderfinded.user).toHaveProperty('email', userMock.email)
    expect(orderfinded.user).toHaveProperty('phone', userMock.phone)
    expect(orderfinded.user).toHaveProperty('badget', userMock.badget)
    expect(orderfinded.user).toHaveProperty('birthday', userMock.birthday)
    expect(orderfinded.user).toHaveProperty('document', userMock.document)
    expect(orderfinded.user).toHaveProperty('password')
    expect(orderfinded.user).toHaveProperty('firstAccess', userMock.firstAccess)
  })

  it('try get order by id with invalid id', async () => {
    expect.assertions(1)

    const orderfinded = await orderDomain.getById(
      'or_dd4e900a-e087-457e-a68d-1e79b6a54b8e',
      companyId
    )

    expect(orderfinded).toBeNull()
  })
})

describe('getAll Order', () => {
  beforeAll(async () => {
    const statusCreated = await StatusDomain.create({
      ...fakerStatus(),
      companyId
    })

    const customerCreated = await customerDomain.create({
      ...generatorFakerCustomer(),
      companyId
    })

    const userCreated = await userDomain.create({
      ...generatorFakerUser(),
      companyId
    })

    const order = {
      statusId: statusCreated.id,
      customerId: customerCreated.id,
      userId: userCreated.id
    }

    await orderDomain.create(companyId, order)
  })

  it('get all order', async () => {
    expect.assertions(3)

    const orderfinded = await orderDomain.getAll({}, companyId)

    expect(orderfinded).toHaveProperty('count')
    expect(orderfinded.count).toBeGreaterThan(1)
    expect(orderfinded).toHaveProperty('rows')
  })
})
