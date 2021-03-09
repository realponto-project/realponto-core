const ProductDomain = require('./')
const { fakerProduct } = require('../../utils/helpers/fakers')
const { ValidationError } = require('sequelize')
const { omit } = require('ramda')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create new product', () => {
  it('create product', async () => {
    expect.hasAssertions()
    const productCreated = await ProductDomain.create({
      ...fakerProduct(),
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    })

    expect(productCreated).toHaveProperty('id')
    expect(productCreated).toHaveProperty('activated')
    expect(productCreated).toHaveProperty('name')
    expect(productCreated).toHaveProperty('barCode')
    expect(productCreated).toHaveProperty('minQuantity')
    expect(productCreated).toHaveProperty('buyPrice')
    expect(productCreated).toHaveProperty('salePrice')
    expect(productCreated).toHaveProperty('companyId')
  })
})

describe('create product without name', () => {
  it('create product without name', async () => {
    expect.hasAssertions()

    await expect(
      ProductDomain.create(omit(['name'], { ...fakerProduct(), companyId }))
    ).rejects.toThrow(new ValidationError('name is a required field'))
  })
})

describe('create product without companyId', () => {
  it('create product without companyId', async () => {
    expect.hasAssertions()

    await expect(
      ProductDomain.create(omit(['companyId'], { ...fakerProduct() }))
    ).rejects.toThrow(new ValidationError('companyId is a required field'))
  })
})

describe('update product', () => {
  let productCreated = null

  beforeAll(async () => {
    productCreated = await ProductDomain.create({
      ...fakerProduct(),
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    })
  })

  it('update product', async () => {
    const productMock = fakerProduct()

    expect.hasAssertions()

    const productUpdated = await ProductDomain.update({
      id: productCreated.id,
      ...productMock,
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    })

    expect(productUpdated).toHaveProperty('id', productCreated.id)
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
})

describe('update product without companyId', () => {
  let productCreated = null

  beforeAll(async () => {
    productCreated = await ProductDomain.create({
      ...fakerProduct(),
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    })
  })

  it('update product without companyId', async () => {
    const productMock = fakerProduct()

    expect.hasAssertions()

    await expect(
      ProductDomain.update(
        omit(['companyId'], { id: productCreated.id, ...productMock })
      )
    ).rejects.toThrow(new ValidationError('companyId is a required field'))
  })
})

describe('getById product', () => {
  let productCreated = null

  beforeAll(async () => {
    productCreated = await ProductDomain.create({
      ...fakerProduct(),
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    })
  })
  it('getById product', async () => {
    expect.hasAssertions()
    expect(true).toBeTruthy()

    const getProductById = await ProductDomain.getById(productCreated.id)

    expect(getProductById).toHaveProperty('id', productCreated.id)
    expect(getProductById).toHaveProperty('activated', productCreated.activated)
    expect(getProductById).toHaveProperty('name', productCreated.name)
    expect(getProductById).toHaveProperty('barCode', productCreated.barCode)
    expect(getProductById).toHaveProperty(
      'minQuantity',
      getProductById.minQuantity
    )
    expect(getProductById).toHaveProperty('buyPrice', productCreated.buyPrice)
    expect(getProductById).toHaveProperty('salePrice', productCreated.salePrice)
    expect(getProductById).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
  })
})

describe('getAll product', () => {
  beforeAll(async () => {
    await ProductDomain.create({
      ...fakerProduct(),
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    })
  })
  it('getAll product', async () => {
    expect.hasAssertions()
    expect(true).toBeTruthy()

    const getAllProduct = await ProductDomain.getAll(
      {},
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )

    expect(getAllProduct).toHaveProperty('rows', getAllProduct.rows)
    expect(getAllProduct).toHaveProperty('count', getAllProduct.count)
  })
})
