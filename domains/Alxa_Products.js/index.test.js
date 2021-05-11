const AlxaProductDomain = require('.')
const { fakerAlxaProduct } = require('../../utils/helpers/fakers')
const factory = require('../../utils/helpers/factories')

describe('create new product', () => {
  let user = null
  let responsibleUserFactory = null

  beforeAll(async () => {
    user = await factory.create('user')
    responsibleUserFactory = await factory.create('user')
  })

  it('create alxa product', async () => {
    expect.hasAssertions()

    const productMock = fakerAlxaProduct()

    const productCreated = await AlxaProductDomain.create({
      ...productMock,
      userId: user.id,
      responsibleUserId: responsibleUserFactory.id
    })

    expect(productCreated).toHaveProperty('id', productCreated.id)
    expect(productCreated).toHaveProperty('activated', productCreated.activated)
    expect(productCreated).toHaveProperty('name', productCreated.name)
    expect(productCreated).toHaveProperty('salePrice', productCreated.salePrice)
    expect(productCreated).toHaveProperty('type', productCreated.type)
  })
})

describe('update product', () => {
  let productFactory = null

  beforeAll(async () => {
    productFactory = await factory.create('alxa_product')
  })

  it('update product', async () => {
    const productMock = fakerAlxaProduct()

    expect.hasAssertions()

    const productUpdated = await AlxaProductDomain.update(productFactory.id, {
      ...productMock
    })

    expect(productUpdated).toHaveProperty('id', productFactory.id)
    expect(productUpdated).toHaveProperty('activated', productMock.activated)
    expect(productUpdated).toHaveProperty('name', productMock.name)
    expect(productUpdated).toHaveProperty('salePrice', productMock.salePrice)
    expect(productUpdated).toHaveProperty('type', productMock.type)
  })
})

describe('get alxa product', () => {
  let productFactory = null

  beforeAll(async () => {
    productFactory = await factory.create('alxa_product')
  })

  it('getById alxa product', async () => {
    expect.hasAssertions()

    const getProductById = await AlxaProductDomain.getById(productFactory.id)

    expect(getProductById).toHaveProperty('id', productFactory.id)
    expect(getProductById).toHaveProperty('activated', productFactory.activated)
    expect(getProductById).toHaveProperty('name', productFactory.name)
    expect(getProductById).toHaveProperty('salePrice', productFactory.salePrice)
    expect(getProductById).toHaveProperty('type', productFactory.type)
  })

  it('getAll alxa product', async () => {
    expect.hasAssertions()

    const getAllProduct = await AlxaProductDomain.getAll({})

    expect(getAllProduct).toHaveProperty('rows')
    expect(getAllProduct).toHaveProperty('count')
  })
})
