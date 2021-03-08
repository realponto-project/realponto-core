const CompanyDomain = require('./')
const { ValidationError } = require('sequelize')

// eslint-disable-next-line jest/expect-expect
describe('create company', () => {
  it('create', async () => {
    expect.assertions(1)

    const company = {
      name: 'Company fullname ltda',
      fullname: 'Fullname company social name ltda',
      document: '43947321821',
      siteUrl: 'www.mycompany.com.br',
      allowOrder: true,
      allowPdv: false
    }

    expect(await CompanyDomain.create(company)).toBeTruthy()
  })
  // eslint-disable-next-line jest/prefer-expect-assertions
  it('create without name', async () => {
    // expect.hasAssertions()

    const company = {
      name: '',
      fullname: 'Fullname company social name ltda',
      document: '43947321821',
      siteUrl: 'www.mycompany.com.br',
      allowOrder: true,
      allowPdv: false
    }

    await expect(CompanyDomain.create(company)).rejects.toThrow(
      new ValidationError('Validation error')
    )
  })
})
