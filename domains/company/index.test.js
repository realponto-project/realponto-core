const { omit } = require('ramda')

const CompanyDomain = require('./')
const { ValidationError } = require('sequelize')
const { fakerCompany } = require('../../utils/helpers/fakers')
const factory = require('../../utils/helpers/factories')

describe('company Domain', () => {
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
        new ValidationError(
          'notNull Violation: company.document cannot be null'
        )
      )
    })
  })

  describe('update company', () => {
    let companyFactory = null

    beforeAll(async () => {
      companyFactory = await factory.create('company')
    })

    it('update company', async () => {
      const companyMock = fakerCompany()

      expect.hasAssertions()

      const productUpdated = await CompanyDomain.update(companyFactory.id, {
        ...companyMock
      })

      expect(productUpdated).toHaveProperty('id', companyFactory.id)
      expect(productUpdated).toHaveProperty('name', companyMock.name)
      expect(productUpdated).toHaveProperty('fullname', companyMock.fullname)
      expect(productUpdated).toHaveProperty('document', companyMock.document)
      expect(productUpdated).toHaveProperty('siteUrl', companyMock.siteUrl)
      expect(productUpdated).toHaveProperty(
        'allowOrder',
        companyMock.allowOrder
      )
      expect(productUpdated).toHaveProperty('allowPdv', companyMock.allowPdv)
    })
  })

  describe('get company', () => {
    let companyFactory = null

    beforeAll(async () => {
      companyFactory = await factory.create('company')
    })

    it('getById company', async () => {
      expect.hasAssertions()

      const getCompanyById = await CompanyDomain.getById(companyFactory.id)

      expect(getCompanyById).toHaveProperty('id', companyFactory.id)
      expect(getCompanyById).toHaveProperty('name', companyFactory.name)
      expect(getCompanyById).toHaveProperty('fullname', companyFactory.fullname)
      expect(getCompanyById).toHaveProperty('document', companyFactory.document)
      expect(getCompanyById).toHaveProperty('siteUrl', companyFactory.siteUrl)
      expect(getCompanyById).toHaveProperty(
        'allowOrder',
        companyFactory.allowOrder
      )
      expect(getCompanyById).toHaveProperty('allowPdv', companyFactory.allowPdv)
    })
    it('getAll company', async () => {
      expect.hasAssertions()

      const getAllCompany = await CompanyDomain.getAll({})

      expect(getAllCompany).toHaveProperty('rows')
      expect(getAllCompany).toHaveProperty('count')
    })
  })
})
