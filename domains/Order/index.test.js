const { map } = require('ramda')
const { ValidationError } = require('sequelize')

const orderDomain = require('.')
const factory = require('../../utils/helpers/factories')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
describe('create Order', () => {
  let statusFactory = null
  let customerFactory = null
  let userFactory = null
  let products = null

  beforeAll(async () => {
    statusFactory = await factory.create('status', {
      type: 'inputs'
    })

    customerFactory = await factory.create('customer')

    userFactory = await factory.create('user')

    const productsFactory = await factory.createMany('product', 3)

    products = productsFactory.map(({ id: productId }) => ({
      productId,
      quantity: 10
    }))
  })

  it('should be able create new order', async () => {
    expect.assertions(8)

    const order = {
      statusId: statusFactory.id,
      customerId: customerFactory.id,
      userId: userFactory.id,
      companyId,
      products
    }

    const orderCreated = await orderDomain.create(order)

    expect(orderCreated).toHaveProperty('id')
    expect(orderCreated.id).toMatch(/^or_/)
    expect(orderCreated).toHaveProperty('companyId', companyId)
    expect(orderCreated).toHaveProperty('statusId', statusFactory.id)
    expect(orderCreated).toHaveProperty('customerId', customerFactory.id)
    expect(orderCreated).toHaveProperty('userId', userFactory.id)
    expect(orderCreated).toHaveProperty('transactions')
    expect(orderCreated.transactions).toContainEqual(
      expect.objectContaining({
        id: expect.stringMatching(/^td_/),
        quantity: 10,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
        productId: expect.stringMatching(/^pr_/),
        orderId: orderCreated.id,
        userId: userFactory.id,
        statusId: statusFactory.id,
        companyId
      })
    )
  })

  it('should be not able create new order with status type equal "outpts" and quantity greader than product balance', async () => {
    expect.assertions(1)

    const status = await factory.create('status', {
      type: 'outputs'
    })

    const order = {
      statusId: status.id,
      customerId: customerFactory.id,
      userId: userFactory.id,
      products: map((item) => ({ ...item, quantity: 100 }), products)
    }

    await expect(orderDomain.create(companyId, order)).rejects.toThrow(
      new ValidationError('Validation error: Validation min on balance failed')
    )
  })

  it('try create order without products', async () => {
    expect.assertions(1)

    const order = {
      statusId: statusFactory.id,
      customerId: customerFactory.id,
      companyId,
      userId: userFactory.id
    }

    await expect(orderDomain.create(order)).rejects.toThrow(
      new Error('products is a required field')
    )
  })

  it('try create order without companyId', async () => {
    expect.assertions(1)

    const order = {
      statusId: statusFactory.id,
      customerId: customerFactory.id,
      userId: userFactory.id,
      products
    }

    await expect(orderDomain.create(order)).rejects.toThrow(
      new Error('company not found')
    )
  })
  it('try create order other companyId', async () => {
    expect.assertions(1)

    const order = {
      statusId: statusFactory.id,
      customerId: customerFactory.id,
      userId: userFactory.id,
      companyId: 'co_5eb458ca-3466-4c89-99d2-e9ae57c0c362',
      products
    }

    await expect(orderDomain.create(order)).rejects.toThrow(
      new Error('status not found or not belongs to company')
    )
  })

  it('try create order without statusId', async () => {
    expect.assertions(1)

    const order = {
      customerId: customerFactory.id,
      userId: userFactory.id,
      companyId: 'co_5eb458ca-3466-4c89-99d2-e9ae57c0c362',
      products
    }

    await expect(orderDomain.create(order)).rejects.toThrow(
      new Error('statusId is a required field')
    )
  })

  it('create order without userId and customerId', async () => {
    expect.assertions(8)

    const order = {
      statusId: statusFactory.id,
      companyId,
      products
    }

    const orderCreated = await orderDomain.create(order)

    expect(orderCreated).toHaveProperty('id')
    expect(orderCreated.id).toMatch(/^or_/)
    expect(orderCreated).toHaveProperty('companyId', companyId)
    expect(orderCreated).toHaveProperty('statusId', statusFactory.id)
    expect(orderCreated).toHaveProperty('customerId', null)
    expect(orderCreated).toHaveProperty('userId', null)
    expect(orderCreated).toHaveProperty('transactions')
    expect(orderCreated.transactions).toContainEqual(
      expect.objectContaining({
        id: expect.stringMatching(/^td_/),
        quantity: 10,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
        productId: expect.stringMatching(/^pr_/),
        orderId: orderCreated.id,
        statusId: statusFactory.id,
        companyId
      })
    )
  })
})

describe('getById Order', () => {
  let orderFactory = null

  beforeAll(async () => {
    orderFactory = await factory.create('order')

    await factory.create('transaction', {
      orderId: orderFactory.id,
      statusId: orderFactory.statusId,
      userId: orderFactory.userId
    })
  })

  it('get order by id', async () => {
    expect.assertions(33)

    const orderfinded = await orderDomain.getById(orderFactory.id, companyId)

    expect(orderfinded).toHaveProperty('id')
    expect(orderfinded.id).toMatch(/^or_/)
    expect(orderfinded).toHaveProperty('companyId', companyId)
    expect(orderfinded).toHaveProperty('statusId', orderFactory.statusId)
    expect(orderfinded).toHaveProperty('customerId', orderFactory.customerId)
    expect(orderfinded).toHaveProperty('userId', orderFactory.userId)
    expect(orderfinded).toHaveProperty('transactions')

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

    expect(orderfinded.transactions).toContainEqual(
      expect.objectContaining({
        id: expect.stringMatching(/^td_/),
        quantity: 10,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
        productId: expect.stringMatching(/^pr_/),
        orderId: orderFactory.id,
        userId: orderFactory.userId,
        statusId: orderFactory.statusId,
        companyId
      })
    )
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

  it('get all order', async () => {
    expect.assertions(3)

    const orderfinded = await orderDomain.getAll({}, companyId)

    expect(orderfinded).toHaveProperty('count')
    expect(orderfinded.count).toBeGreaterThan(0)
    expect(orderfinded).toHaveProperty('rows')
  })
})
