const orderDomain = require('.')
const factory = require('../../utils/helpers/factories')
const truncate = require('../../utils/truncate')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
describe('create Order', () => {
  let statusFactory = null
  let customerFactory = null
  let userFactory = null

  beforeAll(async () => {
    statusFactory = await factory.create('status')

    customerFactory = await factory.create('customer')

    userFactory = await factory.create('user')
  })

  afterAll(async () => {
    await truncate()
  })
  it('new order', async () => {
    expect.assertions(6)

    const order = {
      statusId: statusFactory.id,
      customerId: customerFactory.id,
      userId: userFactory.id
    }

    const orderCreated = await orderDomain.create(companyId, order)

    expect(orderCreated).toHaveProperty('id')
    expect(orderCreated.id).toMatch(/^or_/)
    expect(orderCreated).toHaveProperty('companyId', companyId)
    expect(orderCreated).toHaveProperty('statusId', statusFactory.id)
    expect(orderCreated).toHaveProperty('customerId', customerFactory.id)
    expect(orderCreated).toHaveProperty('userId', userFactory.id)
  })

  it('try create order without companyId', async () => {
    expect.assertions(1)

    const order = {
      statusId: statusFactory.id,
      customerId: customerFactory.id,
      userId: userFactory.id
    }

    await expect(orderDomain.create(undefined, order)).rejects.toThrow(
      new Error('company not found')
    )
  })

  it('try create order other companyId', async () => {
    expect.assertions(1)

    const order = {
      statusId: statusFactory.id,
      customerId: customerFactory.id,
      userId: userFactory.id
    }

    await expect(
      orderDomain.create('co_5eb458ca-3466-4c89-99d2-e9ae57c0c362', order)
    ).rejects.toThrow(new Error('status not found or not belongs to company'))
  })

  it('try create order without statusId', async () => {
    expect.assertions(1)

    const order = {
      customerId: customerFactory.id,
      userId: userFactory.id
    }

    await expect(
      orderDomain.create('co_5eb458ca-3466-4c89-99d2-e9ae57c0c362', order)
    ).rejects.toThrow(new Error('status not found or not belongs to company'))
  })

  it('create order without userId and customerId', async () => {
    expect.assertions(6)

    const order = {
      statusId: statusFactory.id
    }

    const orderCreated = await orderDomain.create(companyId, order)

    expect(orderCreated).toHaveProperty('id')
    expect(orderCreated.id).toMatch(/^or_/)
    expect(orderCreated).toHaveProperty('companyId', companyId)
    expect(orderCreated).toHaveProperty('statusId', statusFactory.id)
    expect(orderCreated).toHaveProperty('customerId', null)
    expect(orderCreated).toHaveProperty('userId', null)
  })
})

describe('getById Order', () => {
  let orderFactory = null

  beforeAll(async () => {
    orderFactory = await factory.create('order')
  })

  afterAll(async () => {
    await truncate()
  })
  it('get order by id', async () => {
    expect.assertions(31)

    const orderfinded = await orderDomain.getById(orderFactory.id, companyId)

    expect(orderfinded).toHaveProperty('id')
    expect(orderfinded.id).toMatch(/^or_/)
    expect(orderfinded).toHaveProperty('companyId', companyId)
    expect(orderfinded).toHaveProperty('statusId', orderFactory.statusId)
    expect(orderfinded).toHaveProperty('customerId', orderFactory.customerId)
    expect(orderfinded).toHaveProperty('userId', orderFactory.userId)

    expect(orderfinded.status).toHaveProperty('id', orderFactory.statusId)
    expect(orderfinded.status.id).toMatch(/^st_/)
    expect(orderfinded.status).toHaveProperty('activated')
    expect(orderfinded.status).toHaveProperty('label')
    expect(orderfinded.status).toHaveProperty('value')
    expect(orderfinded.status).toHaveProperty('color')
    expect(orderfinded.status).toHaveProperty('type')
    expect(orderfinded.status).toHaveProperty('typeLabel')

    expect(orderfinded.customer).toHaveProperty('id', orderFactory.customerId)
    expect(orderfinded.customer.id).toMatch(/^cu_/)
    expect(orderfinded.customer).toHaveProperty('name')
    expect(orderfinded.customer).toHaveProperty('socialName')
    expect(orderfinded.customer).toHaveProperty('document')
    expect(orderfinded.customer).toHaveProperty('phone')

    expect(orderfinded.user).toHaveProperty('id', orderFactory.userId)
    expect(orderfinded.user.id).toMatch(/^us_/)
    expect(orderfinded.user).toHaveProperty('activated')
    expect(orderfinded.user).toHaveProperty('name')
    expect(orderfinded.user).toHaveProperty('email')
    expect(orderfinded.user).toHaveProperty('phone')
    expect(orderfinded.user).toHaveProperty('badget')
    expect(orderfinded.user).toHaveProperty('birthday')
    expect(orderfinded.user).toHaveProperty('document')
    expect(orderfinded.user).toHaveProperty('password')
    expect(orderfinded.user).toHaveProperty('firstAccess')
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
    await factory.create('order')
  })

  afterAll(async () => {
    await truncate()
  })

  it('get all order', async () => {
    expect.assertions(3)

    const orderfinded = await orderDomain.getAll({}, companyId)

    expect(orderfinded).toHaveProperty('count')
    expect(orderfinded.count).toBeGreaterThan(0)
    expect(orderfinded).toHaveProperty('rows')
  })
})