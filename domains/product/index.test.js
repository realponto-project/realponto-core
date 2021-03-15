const ProductDomain = require('./')
const { fakerProduct } = require('../../utils/helpers/fakers')
const { ValidationError } = require('sequelize')
const { omit } = require('ramda')
const factory = require('../../utils/helpers/factories')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create new product', () => {
  it('create product', async () => {
    expect.hasAssertions()
    const productCreated = await ProductDomain.create({
      ...fakerProduct(),
      companyId
    })

    expect(productCreated).toHaveProperty('id', productCreated.id)
    expect(productCreated).toHaveProperty('activated', productCreated.activated)
    expect(productCreated).toHaveProperty('name', productCreated.name)
    expect(productCreated).toHaveProperty('barCode', productCreated.barCode)
    expect(productCreated).toHaveProperty(
      'minQuantity',
      productCreated.minQuantity
    )
    expect(productCreated).toHaveProperty('buyPrice', productCreated.buyPrice)
    expect(productCreated).toHaveProperty('salePrice', productCreated.salePrice)
    expect(productCreated).toHaveProperty('companyId')
  })

  it('create product without name', async () => {
    expect.hasAssertions()

    await expect(
      ProductDomain.create(omit(['name'], { ...fakerProduct(), companyId }))
    ).rejects.toThrow(new ValidationError('name is a required field'))
  })

  it('create product without barCode', async () => {
    expect.hasAssertions()

    await expect(
      ProductDomain.create(omit(['barCode'], { ...fakerProduct(), companyId }))
    ).rejects.toThrow(new ValidationError('barCode is a required field'))
  })

  it('create product without companyId', async () => {
    expect.hasAssertions()

    await expect(
      ProductDomain.create(omit(['companyId'], { ...fakerProduct() }))
    ).rejects.toThrow(new ValidationError('companyId is a required field'))
  })
})

describe('update product', () => {
  let productFactory = null

  beforeAll(async () => {
    productFactory = await factory.create('product')
  })

  it('update product', async () => {
    const productMock = fakerProduct()

    expect.hasAssertions()

    const productUpdated = await ProductDomain.update(productFactory.id, {
      ...productMock,
      companyId
    })

    expect(productUpdated).toHaveProperty('id', productFactory.id)
    expect(productUpdated).toHaveProperty('activated', productMock.activated)
    expect(productUpdated).toHaveProperty('name', productMock.name)
    expect(productUpdated).toHaveProperty('barCode', productMock.barCode)
    expect(productUpdated).toHaveProperty(
      'minQuantity',
      productUpdated.minQuantity
    )
    expect(productUpdated).toHaveProperty('buyPrice', productMock.buyPrice)
    expect(productUpdated).toHaveProperty('salePrice', productMock.salePrice)
    expect(productUpdated).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
  })

  it('update product without companyId', async () => {
    const productMock = fakerProduct()

    expect.hasAssertions()

    await expect(
      ProductDomain.update(
        productFactory.id,
        omit(['companyId'], { ...productMock })
      )
    ).rejects.toThrow(new ValidationError('companyId is a required field'))
  })
})

describe('get product', () => {
  let productFactory = null

  beforeAll(async () => {
    productFactory = await factory.create('product')
  })
  it('getById product', async () => {
    expect.hasAssertions()

    const getProductById = await ProductDomain.getById(
      productFactory.id,
      companyId
    )

    expect(getProductById).toHaveProperty('id', productFactory.id)
    expect(getProductById).toHaveProperty('activated', productFactory.activated)
    expect(getProductById).toHaveProperty('name', productFactory.name)
    expect(getProductById).toHaveProperty('barCode', productFactory.barCode)
    expect(getProductById).toHaveProperty(
      'minQuantity',
      getProductById.minQuantity
    )
    expect(getProductById).toHaveProperty('buyPrice', productFactory.buyPrice)
    expect(getProductById).toHaveProperty('salePrice', productFactory.salePrice)
    expect(getProductById).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
  })

  it('getAll product', async () => {
    expect.hasAssertions()

    const getAllProduct = await ProductDomain.getAll(
      {},
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )

    expect(getAllProduct).toHaveProperty('rows')
    expect(getAllProduct).toHaveProperty('count')
  })
})
