const { omit } = require('ramda')
const { ValidationError } = require('sequelize')

const addressDomain = require('.')
const { generatorFakerAddress } = require('../../utils/helpers/Faker/address')
const factory = require('../../utils/helpers/factories')
describe('create Address', () => {
  it('create new address', async () => {
    expect.assertions(10)

    const addressMock = generatorFakerAddress()
    const addressCreated = await addressDomain.create(addressMock)

    expect(addressCreated).toHaveProperty('id')
    expect(addressCreated.id).toMatch(/^ad_/)
    expect(addressCreated).toHaveProperty(
      'neighborhood',
      addressMock.neighborhood
    )
    expect(addressCreated).toHaveProperty('street', addressMock.street)
    expect(addressCreated).toHaveProperty(
      'streetNumber',
      addressMock.streetNumber
    )
    expect(addressCreated).toHaveProperty('city', addressMock.city)
    expect(addressCreated).toHaveProperty('states', addressMock.states)
    expect(addressCreated).toHaveProperty('zipcode', addressMock.zipcode)
    expect(addressCreated).toHaveProperty(
      'complementary',
      addressMock.complementary
    )
    expect(addressCreated).toHaveProperty('reference', addressMock.reference)
  })

  it('try create new address without neighborhood', async () => {
    expect.assertions(1)

    await expect(
      addressDomain.create(omit(['neighborhood'], generatorFakerAddress()))
    ).rejects.toThrow(
      new ValidationError(
        'notNull Violation: address.neighborhood cannot be null'
      )
    )
  })

  it('try create new address without street', async () => {
    expect.assertions(1)

    await expect(
      addressDomain.create(omit(['street'], generatorFakerAddress()))
    ).rejects.toThrow(
      new ValidationError('notNull Violation: address.street cannot be null')
    )
  })

  it('try create new address without streetNumber', async () => {
    expect.assertions(1)

    await expect(
      addressDomain.create(omit(['streetNumber'], generatorFakerAddress()))
    ).rejects.toThrow(
      new ValidationError(
        'notNull Violation: address.streetNumber cannot be null'
      )
    )
  })

  it('try create new address without city', async () => {
    expect.assertions(1)

    await expect(
      addressDomain.create(omit(['city'], generatorFakerAddress()))
    ).rejects.toThrow(
      new ValidationError('notNull Violation: address.city cannot be null')
    )
  })

  it('try create new address without states', async () => {
    expect.assertions(1)

    await expect(
      addressDomain.create(omit(['states'], generatorFakerAddress()))
    ).rejects.toThrow(
      new ValidationError('notNull Violation: address.states cannot be null')
    )
  })

  it('try create new address without zipcode', async () => {
    expect.assertions(1)

    await expect(
      addressDomain.create(omit(['zipcode'], generatorFakerAddress()))
    ).rejects.toThrow(
      new ValidationError('notNull Violation: address.zipcode cannot be null')
    )
  })

  it('try create new address without complementary and reference', async () => {
    expect.assertions(10)
    const addressMock = generatorFakerAddress()
    const addressCreated = await addressDomain.create(
      omit(['complementary', 'reference'], addressMock)
    )

    expect(addressCreated).toHaveProperty('id')
    expect(addressCreated.id).toMatch(/^ad_/)
    expect(addressCreated).toHaveProperty(
      'neighborhood',
      addressMock.neighborhood
    )
    expect(addressCreated).toHaveProperty('street', addressMock.street)
    expect(addressCreated).toHaveProperty(
      'streetNumber',
      addressMock.streetNumber
    )
    expect(addressCreated).toHaveProperty('city', addressMock.city)
    expect(addressCreated).toHaveProperty('states', addressMock.states)
    expect(addressCreated).toHaveProperty('zipcode', addressMock.zipcode)
    expect(addressCreated).toHaveProperty(
      'complementary',
      addressMock.complementary,
      undefined
    )
    expect(addressCreated).toHaveProperty('reference', undefined)
  })
})

describe('update Address', () => {
  let address = null
  beforeAll(async () => {
    address = await factory.create('address')
  })
  it('update address', async () => {
    expect.assertions(9)
    const addressMock = generatorFakerAddress()
    const addressUpdated = await addressDomain.update(address.id, addressMock)

    expect(addressUpdated).toHaveProperty('id', address.id)
    expect(addressUpdated).toHaveProperty(
      'neighborhood',
      addressMock.neighborhood
    )
    expect(addressUpdated).toHaveProperty('street', addressMock.street)
    expect(addressUpdated).toHaveProperty(
      'streetNumber',
      addressMock.streetNumber
    )
    expect(addressUpdated).toHaveProperty('city', addressMock.city)
    expect(addressUpdated).toHaveProperty('states', addressMock.states)
    expect(addressUpdated).toHaveProperty('zipcode', addressMock.zipcode)
    expect(addressUpdated).toHaveProperty(
      'complementary',
      addressMock.complementary
    )
    expect(addressUpdated).toHaveProperty('reference', addressMock.reference)
  })
})
