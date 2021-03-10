const StatusDomain = require('./index')
const { fakerStatus } = require('../../utils/helpers/fakers')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'

describe('create new status', () => {
  it('create new status', async () => {
    expect.hasAssertions()
    const statusCreated = await StatusDomain.create({
      ...fakerStatus(),
      companyId
    })
    expect(statusCreated).toHaveProperty('id')
    expect(statusCreated).toHaveProperty('activated')
    expect(statusCreated).toHaveProperty('label')
    expect(statusCreated).toHaveProperty('value')
    expect(statusCreated).toHaveProperty('color')
    expect(statusCreated).toHaveProperty('type')
    expect(statusCreated).toHaveProperty('typeLabel')
    expect(statusCreated).toHaveProperty('fakeTransaction')
    expect(statusCreated).toHaveProperty('companyId')
  })
})

describe('update status', () => {
  let statusCreated = null

  beforeAll(async () => {
    statusCreated = await StatusDomain.create({
      ...fakerStatus(),
      companyId
    })
  })

  it('update status', async () => {
    const statusMock = fakerStatus()

    expect.hasAssertions()

    const statusUpdated = await StatusDomain.update(statusCreated.id, {
      ...statusMock,
      companyId
    })

    expect(statusUpdated).toHaveProperty('id', statusCreated.id)
    expect(statusUpdated).toHaveProperty('activated', statusMock.activated)
    expect(statusUpdated).toHaveProperty('label', statusMock.label)
    expect(statusUpdated).toHaveProperty('value', statusMock.value)
    expect(statusUpdated).toHaveProperty('color', statusMock.color)
    expect(statusUpdated).toHaveProperty('type', statusMock.type)
    expect(statusUpdated).toHaveProperty('typeLabel', statusMock.typeLabel)
    expect(statusUpdated).toHaveProperty(
      'fakeTransaction',
      statusMock.fakeTransaction
    )
    expect(statusCreated).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
  })
})

describe('getById status', () => {
  let statusCreated = null

  beforeAll(async () => {
    statusCreated = await StatusDomain.create({
      ...fakerStatus(),
      companyId
    })
  })

  it('getById status', async () => {
    expect.hasAssertions()

    const getStatusById = await StatusDomain.getById(
      statusCreated.id,
      companyId
    )

    expect(getStatusById).toHaveProperty('id', statusCreated.id)
    expect(getStatusById).toHaveProperty('activated', statusCreated.activated)
    expect(getStatusById).toHaveProperty('label', statusCreated.label)
    expect(getStatusById).toHaveProperty('value', statusCreated.value)
    expect(getStatusById).toHaveProperty('color', statusCreated.color)
    expect(getStatusById).toHaveProperty('type', statusCreated.type)
    expect(getStatusById).toHaveProperty('typeLabel', statusCreated.typeLabel)
    expect(getStatusById).toHaveProperty(
      'fakeTransaction',
      statusCreated.fakeTransaction
    )
    expect(getStatusById).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
  })
})

describe('getAll status', () => {
  beforeAll(async () => {
    await StatusDomain.create({
      ...fakerStatus(),
      companyId
    })
  })

  it('getAll status', async () => {
    expect.hasAssertions()

    const getAllStatus = await StatusDomain.getAll(
      {},
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )

    expect(getAllStatus).toHaveProperty('rows')
    expect(getAllStatus).toHaveProperty('count')
  })
})
