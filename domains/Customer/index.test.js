const customerDomain = require('.')
const { generatorFakerCustomer } = require('../../utils/helpers/Faker/customer')
const { generatorFakerAddress } = require('../../utils/helpers/Faker/address')
const factory = require('../../utils/helpers/factories')

const { NotFoundError } = require('../../utils/helpers/errors')
const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create Customer', () => {
  it('create new customer with address', async () => {
    expect.assertions(19)

    const customerMock = generatorFakerCustomer()
    const addressMock = generatorFakerAddress()

    const customerCreated = await customerDomain.create({
      ...customerMock,
      address: addressMock,
      companyId
    })

    expect(customerCreated).toHaveProperty('id')
    expect(customerCreated.id).toMatch(/^cu_/)
    expect(customerCreated).toHaveProperty('name', customerMock.name)
    expect(customerCreated).toHaveProperty(
      'socialName',
      customerMock.socialName
    )
    expect(customerCreated).toHaveProperty('document', customerMock.document)
    expect(customerCreated).toHaveProperty('phone', customerMock.phone)
    expect(customerCreated).toHaveProperty('addressId')
    expect(customerCreated).toHaveProperty('address')
    expect(customerCreated).toHaveProperty('companyId', companyId)
    expect(customerCreated.address).toHaveProperty('id')
    expect(customerCreated.address.id).toMatch(/^ad_/)
    expect(customerCreated.address).toHaveProperty(
      'neighborhood',
      addressMock.neighborhood
    )
    expect(customerCreated.address).toHaveProperty('street', addressMock.street)
    expect(customerCreated.address).toHaveProperty(
      'streetNumber',
      addressMock.streetNumber
    )
    expect(customerCreated.address).toHaveProperty('city', addressMock.city)
    expect(customerCreated.address).toHaveProperty('states', addressMock.states)
    expect(customerCreated.address).toHaveProperty(
      'zipcode',
      addressMock.zipcode
    )
    expect(customerCreated.address).toHaveProperty(
      'complementary',
      addressMock.complementary
    )
    expect(customerCreated.address).toHaveProperty(
      'reference',
      addressMock.reference
    )
  })

  it('create new customer without address', async () => {
    expect.assertions(9)

    const customerCreated = await customerDomain.create({
      ...generatorFakerCustomer(),
      companyId
    })

    expect(customerCreated).toHaveProperty('id')
    expect(customerCreated.id).toMatch(/^cu_/)
    expect(customerCreated).toHaveProperty('name', customerCreated.name)
    expect(customerCreated).toHaveProperty(
      'socialName',
      customerCreated.socialName
    )
    expect(customerCreated).toHaveProperty('document', customerCreated.document)
    expect(customerCreated).toHaveProperty('phone', customerCreated.phone)
    expect(customerCreated).toHaveProperty('addressId', null)
    expect(customerCreated).toHaveProperty('address', null)
    expect(customerCreated).toHaveProperty('companyId', companyId)
  })
})

describe('update Customer', () => {
  let customerFactory = null
  let customerFactoryWithoutAddress = null
  beforeAll(async () => {
    customerFactory = await factory.create('customer')
    customerFactoryWithoutAddress = await factory.create('customer', {
      addressId: null
    })
  })

  it('update only customer', async () => {
    expect.assertions(8)

    const customerMock = generatorFakerCustomer()

    const customerupdated = await customerDomain.update(
      customerFactory.id,
      companyId,
      {
        ...customerMock
      }
    )

    expect(customerupdated).toHaveProperty('id', customerFactory.id)
    expect(customerupdated).toHaveProperty('name', customerMock.name)
    expect(customerupdated).toHaveProperty(
      'socialName',
      customerMock.socialName
    )
    expect(customerupdated).toHaveProperty('document', customerMock.document)
    expect(customerupdated).toHaveProperty('phone', customerMock.phone)
    expect(customerupdated).toHaveProperty(
      'addressId',
      customerFactory.addressId
    )
    expect(customerupdated).toHaveProperty('address')
    expect(customerupdated).toHaveProperty('companyId', companyId)
  })

  it('update customer and address', async () => {
    expect.assertions(17)

    const customerMock = generatorFakerCustomer()
    const addressMock = generatorFakerAddress()

    const customerupdated = await customerDomain.update(
      customerFactory.id,
      companyId,
      {
        ...customerMock,
        address: addressMock,
        companyId
      }
    )

    expect(customerupdated).toHaveProperty('id', customerFactory.id)
    expect(customerupdated).toHaveProperty('name', customerMock.name)
    expect(customerupdated).toHaveProperty(
      'socialName',
      customerMock.socialName
    )
    expect(customerupdated).toHaveProperty('document', customerMock.document)
    expect(customerupdated).toHaveProperty('phone', customerMock.phone)
    expect(customerupdated).toHaveProperty(
      'addressId',
      customerFactory.addressId
    )
    expect(customerupdated).toHaveProperty('address')
    expect(customerupdated).toHaveProperty('companyId', companyId)
    expect(customerupdated.address).toHaveProperty(
      'id',
      customerFactory.addressId
    )
    expect(customerupdated.address).toHaveProperty(
      'neighborhood',
      addressMock.neighborhood
    )
    expect(customerupdated.address).toHaveProperty('street', addressMock.street)
    expect(customerupdated.address).toHaveProperty(
      'streetNumber',
      addressMock.streetNumber
    )
    expect(customerupdated.address).toHaveProperty('city', addressMock.city)
    expect(customerupdated.address).toHaveProperty('states', addressMock.states)
    expect(customerupdated.address).toHaveProperty(
      'zipcode',
      addressMock.zipcode
    )
    expect(customerupdated.address).toHaveProperty(
      'complementary',
      addressMock.complementary
    )
    expect(customerupdated.address).toHaveProperty(
      'reference',
      addressMock.reference
    )
  })

  it('update customer without address', async () => {
    expect.assertions(17)

    const addressMock = generatorFakerAddress()

    const customerupdated = await customerDomain.update(
      customerFactoryWithoutAddress.id,
      companyId,
      {
        address: addressMock,
        companyId
      }
    )

    expect(customerupdated).toHaveProperty(
      'id',
      customerFactoryWithoutAddress.id
    )
    expect(customerupdated).toHaveProperty(
      'name',
      customerFactoryWithoutAddress.name
    )
    expect(customerupdated).toHaveProperty(
      'socialName',
      customerFactoryWithoutAddress.socialName
    )
    expect(customerupdated).toHaveProperty(
      'document',
      customerFactoryWithoutAddress.document
    )
    expect(customerupdated).toHaveProperty(
      'phone',
      customerFactoryWithoutAddress.phone
    )
    expect(customerupdated).toHaveProperty('addressId')
    expect(customerupdated).toHaveProperty('address')
    expect(customerupdated).toHaveProperty('companyId', companyId)
    expect(customerupdated.address).toHaveProperty('id')
    expect(customerupdated.address).toHaveProperty(
      'neighborhood',
      addressMock.neighborhood
    )
    expect(customerupdated.address).toHaveProperty('street', addressMock.street)
    expect(customerupdated.address).toHaveProperty(
      'streetNumber',
      addressMock.streetNumber
    )
    expect(customerupdated.address).toHaveProperty('city', addressMock.city)
    expect(customerupdated.address).toHaveProperty('states', addressMock.states)
    expect(customerupdated.address).toHaveProperty(
      'zipcode',
      addressMock.zipcode
    )
    expect(customerupdated.address).toHaveProperty(
      'complementary',
      addressMock.complementary
    )
    expect(customerupdated.address).toHaveProperty(
      'reference',
      addressMock.reference
    )
  })
  it('try update customer withou id', async () => {
    expect.assertions(1)

    const customerMock = generatorFakerCustomer()

    await expect(
      customerDomain.update(undefined, companyId, {
        ...customerMock,
        companyId
      })
    ).rejects.toThrow(new NotFoundError('user not found'))
  })
})

describe('getById Customer', () => {
  let customerFactory = null
  beforeAll(async () => {
    customerFactory = await factory.create('customer')
  })

  it('get customer by id', async () => {
    expect.assertions(9)

    const customerFinded = await customerDomain.getById(
      customerFactory.id,
      companyId
    )

    expect(customerFinded).toHaveProperty('id', customerFactory.id)
    expect(customerFinded).toHaveProperty('name', customerFactory.name)
    expect(customerFinded).toHaveProperty(
      'socialName',
      customerFactory.socialName
    )
    expect(customerFinded).toHaveProperty('document', customerFactory.document)
    expect(customerFinded).toHaveProperty('phone', customerFactory.phone)
    expect(customerFinded).toHaveProperty(
      'addressId',
      customerFactory.addressId
    )
    expect(customerFinded).toHaveProperty('address')
    expect(customerFinded).toHaveProperty(
      'companyId',
      customerFactory.companyId
    )
    expect(customerFinded).toHaveProperty('company')
  })
})
describe('getAll Customer', () => {
  beforeAll(async () => {
    await factory.create('customer')
  })

  it('get customer by id', async () => {
    expect.assertions(3)

    const customersFinded = await customerDomain.getAll({}, companyId)

    expect(customersFinded).toHaveProperty('count')
    expect(customersFinded.count).toBeGreaterThan(1)
    expect(customersFinded).toHaveProperty('rows')
  })
})
