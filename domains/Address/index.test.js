const { omit } = require('ramda')
const { ValidationError } = require('sequelize')

const addressDomain = require('.')
const { generatorFakerAddress } = require('../../utils/helpers/Faker/address')

describe('create Address', () => {
  it('create new address', async () => {
    expect.assertions(9)
    const addressCreated = await addressDomain.create(generatorFakerAddress())

    expect(addressCreated).toHaveProperty('id')
    expect(addressCreated).toHaveProperty('neighborhood')
    expect(addressCreated).toHaveProperty('street')
    expect(addressCreated).toHaveProperty('streetNumber')
    expect(addressCreated).toHaveProperty('city')
    expect(addressCreated).toHaveProperty('states')
    expect(addressCreated).toHaveProperty('zipcode')
    expect(addressCreated).toHaveProperty('complementary')
    expect(addressCreated).toHaveProperty('reference')
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
    expect.assertions(9)
    const addressCreated = await addressDomain.create(
      omit(['complementary', 'reference'], generatorFakerAddress())
    )

    expect(addressCreated).toHaveProperty('id')
    expect(addressCreated).toHaveProperty('neighborhood')
    expect(addressCreated).toHaveProperty('street')
    expect(addressCreated).toHaveProperty('streetNumber')
    expect(addressCreated).toHaveProperty('city')
    expect(addressCreated).toHaveProperty('states')
    expect(addressCreated).toHaveProperty('zipcode')
    expect(addressCreated).toHaveProperty('complementary', null)
    expect(addressCreated).toHaveProperty('reference', null)
  })
})

describe('update Address', () => {
  let address = null
  beforeAll(async () => {
    address = await addressDomain.create(generatorFakerAddress())
  })
  it('update address', async () => {
    expect.assertions(9)
    const addressUpdated = await addressDomain.update(
      address.id,
      generatorFakerAddress()
    )

    expect(addressUpdated).toHaveProperty('id', address.id)
    expect(addressUpdated).toHaveProperty('neighborhood')
    expect(addressUpdated).toHaveProperty('street')
    expect(addressUpdated).toHaveProperty('streetNumber')
    expect(addressUpdated).toHaveProperty('city')
    expect(addressUpdated).toHaveProperty('states')
    expect(addressUpdated).toHaveProperty('zipcode')
    expect(addressUpdated).toHaveProperty('complementary')
    expect(addressUpdated).toHaveProperty('reference')
  })
})
