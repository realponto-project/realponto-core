const { omit } = require('ramda')

const CompanyDomain = require('./')
const { ValidationError } = require('sequelize')
const { fakerCompany } = require('../../utils/helpers/fakers')

describe('create company', () => {
  it('create new company', async () => {
    expect.hasAssertions()
    const companyCreated = await CompanyDomain.create({
      ...fakerCompany()
    })
    expect(companyCreated).toHaveProperty('id')
    expect(companyCreated).toHaveProperty('name')
    expect(companyCreated).toHaveProperty('fullname')
    expect(companyCreated).toHaveProperty('document')
    expect(companyCreated).toHaveProperty('siteUrl')
    expect(companyCreated).toHaveProperty('allowOrder')
    expect(companyCreated).toHaveProperty('allowPdv')
  })

  it('create company without name', async () => {
    expect.hasAssertions()

    await expect(
      CompanyDomain.create(omit(['name'], { ...fakerCompany() }))
    ).rejects.toThrow(
      new ValidationError('notNull Violation: company.name cannot be null')
    )
  })

  it('create company without document', async () => {
    expect.hasAssertions()

    await expect(
      CompanyDomain.create(omit(['document'], { ...fakerCompany() }))
    ).rejects.toThrow(
      new ValidationError('notNull Violation: company.document cannot be null')
    )
  })
})

describe('update company', () => {
  let companyCreated = null

  beforeAll(async () => {
    companyCreated = await CompanyDomain.create({
      ...fakerCompany()
    })
  })

  it('update company with name invalid', async () => {
    const companyMock = fakerCompany()

    expect.hasAssertions()

    const productUpdated = await CompanyDomain.update(companyCreated.id, {
      ...companyMock
    })

    expect(productUpdated).toHaveProperty('id', companyCreated.id)
    expect(productUpdated).toHaveProperty('name', companyMock.name)
    expect(productUpdated).toHaveProperty('fullname', companyMock.fullname)
    expect(productUpdated).toHaveProperty('document', companyMock.document)
    expect(productUpdated).toHaveProperty('siteUrl', companyMock.siteUrl)
    expect(productUpdated).toHaveProperty('allowOrder', companyMock.allowOrder)
    expect(productUpdated).toHaveProperty('allowPdv', companyMock.allowPdv)
  })
})

describe('getById company', () => {
  let companyCreated = null

  beforeAll(async () => {
    companyCreated = await CompanyDomain.create({
      ...fakerCompany()
    })
  })

  it('getById company', async () => {
    expect.hasAssertions()

    const getCompanyById = await CompanyDomain.getById(companyCreated.id)

    expect(getCompanyById).toHaveProperty('id', companyCreated.id)
    expect(getCompanyById).toHaveProperty('name', companyCreated.name)
    expect(getCompanyById).toHaveProperty('fullname', companyCreated.fullname)
    expect(getCompanyById).toHaveProperty('document', companyCreated.document)
    expect(getCompanyById).toHaveProperty('siteUrl', companyCreated.siteUrl)
    expect(getCompanyById).toHaveProperty(
      'allowOrder',
      companyCreated.allowOrder
    )
    expect(getCompanyById).toHaveProperty('allowPdv', companyCreated.allowPdv)
  })
})

describe('getAll company', () => {
  beforeAll(async () => {
    await CompanyDomain.create({
      ...fakerCompany()
    })
  })

  it('getAll company', async () => {
    expect.hasAssertions()

    const getAllCompany = await CompanyDomain.getAll({})

    expect(getAllCompany).toHaveProperty('rows')
    expect(getAllCompany).toHaveProperty('count')
  })
})
