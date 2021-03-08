const customerDomain = require('.')
const { generatorFakerCustomer } = require('../../utils/helpers/Faker/customer')
const { generatorFakerAddress } = require('../../utils/helpers/Faker/address')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create Customer', () => {
  it('create new customer with address', async () => {
    expect.assertions(17)

    const costumerMock = generatorFakerCustomer()

    const customerCreated = await customerDomain.create({
      ...costumerMock,
      address: generatorFakerAddress(),
      companyId
    })

    expect(customerCreated).toHaveProperty('id')
    expect(customerCreated).toHaveProperty('name', costumerMock.name)
    expect(customerCreated).toHaveProperty(
      'socialName',
      costumerMock.socialName
    )
    expect(customerCreated).toHaveProperty('document', costumerMock.document)
    expect(customerCreated).toHaveProperty('phone', costumerMock.phone)
    expect(customerCreated).toHaveProperty('addressId')
    expect(customerCreated).toHaveProperty('address')
    expect(customerCreated).toHaveProperty('companyId', companyId)
    expect(customerCreated.address).toHaveProperty('id')
    expect(customerCreated.address).toHaveProperty('neighborhood')
    expect(customerCreated.address).toHaveProperty('street')
    expect(customerCreated.address).toHaveProperty('streetNumber')
    expect(customerCreated.address).toHaveProperty('city')
    expect(customerCreated.address).toHaveProperty('states')
    expect(customerCreated.address).toHaveProperty('zipcode')
    expect(customerCreated.address).toHaveProperty('complementary')
    expect(customerCreated.address).toHaveProperty('reference')
  })

  it('create new customer without address', async () => {
    expect.assertions(8)

    const customerCreated = await customerDomain.create({
      ...generatorFakerCustomer(),
      companyId
    })

    expect(customerCreated).toHaveProperty('id')
    expect(customerCreated).toHaveProperty('name')
    expect(customerCreated).toHaveProperty('socialName')
    expect(customerCreated).toHaveProperty('document')
    expect(customerCreated).toHaveProperty('addressId', null)
    expect(customerCreated).toHaveProperty('address', null)
    expect(customerCreated).toHaveProperty('phone')
    expect(customerCreated).toHaveProperty('companyId', companyId)
  })
})

describe('update Customer', () => {
  let custumer = null
  beforeAll(async () => {
    custumer = await customerDomain.create({
      ...generatorFakerCustomer(),
      address: generatorFakerAddress(),
      companyId
    })
  })

  it('update only customer', async () => {
    expect.assertions(9)

    const costumerMock = generatorFakerCustomer()

    const customerupdated = await customerDomain.update(
      custumer.id,
      companyId,
      {
        ...costumerMock,
        companyId
      }
    )

    expect(customerupdated).toHaveProperty('id', custumer.id)
    expect(customerupdated).toHaveProperty('name', costumerMock.name)
    expect(customerupdated).toHaveProperty(
      'socialName',
      costumerMock.socialName
    )
    expect(customerupdated).toHaveProperty('document', costumerMock.document)
    expect(customerupdated).toHaveProperty('phone', costumerMock.phone)
    expect(customerupdated).toHaveProperty('addressId', custumer.addressId)
    expect(customerupdated).toHaveProperty('address')
    expect(customerupdated).toHaveProperty('companyId', companyId)
    expect(customerupdated.address).toStrictEqual(custumer.address)
  })

  it('update customer and address', async () => {
    expect.assertions(17)

    const costumerMock = generatorFakerCustomer()
    const addressMock = generatorFakerAddress()

    const customerupdated = await customerDomain.update(
      custumer.id,
      companyId,
      {
        ...costumerMock,
        address: addressMock,
        companyId
      }
    )

    expect(customerupdated).toHaveProperty('id', custumer.id)
    expect(customerupdated).toHaveProperty('name', costumerMock.name)
    expect(customerupdated).toHaveProperty(
      'socialName',
      costumerMock.socialName
    )
    expect(customerupdated).toHaveProperty('document', costumerMock.document)
    expect(customerupdated).toHaveProperty('phone', costumerMock.phone)
    expect(customerupdated).toHaveProperty('addressId', custumer.addressId)
    expect(customerupdated).toHaveProperty('address')
    expect(customerupdated).toHaveProperty('companyId', companyId)
    expect(customerupdated.address).toHaveProperty('id', custumer.addressId)
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
})

describe('getById Customer', () => {
  let custumer = null
  beforeAll(async () => {
    custumer = await customerDomain.create({
      ...generatorFakerCustomer(),
      address: generatorFakerAddress(),
      companyId
    })
  })

  it('get customer by id', async () => {
    expect.assertions(10)

    const customerFinded = await customerDomain.getById(custumer.id, companyId)

    expect(customerFinded).toHaveProperty('id', custumer.id)
    expect(customerFinded).toHaveProperty('name', custumer.name)
    expect(customerFinded).toHaveProperty('socialName', custumer.socialName)
    expect(customerFinded).toHaveProperty('document', custumer.document)
    expect(customerFinded).toHaveProperty('phone', custumer.phone)
    expect(customerFinded).toHaveProperty('addressId', custumer.addressId)
    expect(customerFinded).toHaveProperty('address', custumer.address)
    expect(customerFinded).toHaveProperty('companyId', custumer.companyId)
    expect(customerFinded).toHaveProperty('company')
    expect(customerFinded.address).toStrictEqual(custumer.address)
  })
})
describe('getAll Customer', () => {
  beforeAll(async () => {
    await customerDomain.create({
      ...generatorFakerCustomer(),
      address: generatorFakerAddress(),
      companyId
    })
  })

  it('get customer by id', async () => {
    expect.assertions(3)

    const customersFinded = await customerDomain.getAll({}, companyId)

    expect(customersFinded).toHaveProperty('count')
    expect(customersFinded.count).toBeGreaterThan(1)
    expect(customersFinded).toHaveProperty('rows')
  })
})
