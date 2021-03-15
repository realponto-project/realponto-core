const StatusDomain = require('./index')
const { fakerStatus } = require('../../utils/helpers/fakers')
const factory = require('../../utils/helpers/factories')

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
    expect(statusCreated).toHaveProperty('companyId')
  })
})

describe('update status', () => {
  let statusFactory = null

  beforeAll(async () => {
    statusFactory = await factory.create('status')
  })

  it('update status', async () => {
    const statusMock = fakerStatus()

    expect.hasAssertions()

    const statusUpdated = await StatusDomain.update(statusFactory.id, {
      ...statusMock,
      companyId
    })

    expect(statusUpdated).toHaveProperty('id', statusFactory.id)
    expect(statusUpdated).toHaveProperty('activated', statusMock.activated)
    expect(statusUpdated).toHaveProperty('label', statusMock.label)
    expect(statusUpdated).toHaveProperty('value', statusMock.value)
    expect(statusUpdated).toHaveProperty('color', statusMock.color)
    expect(statusUpdated).toHaveProperty('type', statusMock.type)
    expect(statusUpdated).toHaveProperty('typeLabel', statusMock.typeLabel)
    expect(statusFactory).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
  })
})

describe('get status', () => {
  let statusFactory = null

  beforeAll(async () => {
    statusFactory = await factory.create('status')
  })

  it('getById status', async () => {
    expect.hasAssertions()

    const getStatusById = await StatusDomain.getById(
      statusFactory.id,
      companyId
    )

    expect(getStatusById).toHaveProperty('id', statusFactory.id)
    expect(getStatusById).toHaveProperty('activated', statusFactory.activated)
    expect(getStatusById).toHaveProperty('label', statusFactory.label)
    expect(getStatusById).toHaveProperty('value', statusFactory.value)
    expect(getStatusById).toHaveProperty('color', statusFactory.color)
    expect(getStatusById).toHaveProperty('type', statusFactory.type)
    expect(getStatusById).toHaveProperty('typeLabel', statusFactory.typeLabel)
    expect(getStatusById).toHaveProperty(
      'companyId',
      'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    )
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
