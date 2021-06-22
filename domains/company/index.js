const buildPagination = require('../../utils/helpers/searchSpec')
const companySchema = require('../../utils/helpers/Schemas/company')
const database = require('../../database')

const CompanyModel = database.model('company')
const SubscriptionModel = database.model('subscription')
const PlanModel = database.model('plan')
const ImageModel = database.model('image')

const buildSearchAndPagination = buildPagination('company')

class CompanyDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    return await CompanyModel.create(bodyData, { transaction })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    await companySchema.validate(bodyData, { abortEarly: false })

    const searchCompany = await CompanyModel.findByPk(id)

    return await searchCompany.update(bodyData, { transaction })
  }

  async getById(id, options = {}) {
    const { transaction = null } = options

    const comany = await CompanyModel.findByPk(id, {
      include: [
        {
          model: SubscriptionModel,
          attributes: ['id', 'planId'],
          include: [{ model: PlanModel, attributes: ['quantityProduct'] }]
        },
        {
          model: ImageModel,
          as: 'logo'
        }
      ],
      transaction
    })

    return comany
  }

  async getAll(query) {
    return await CompanyModel.findAndCountAll(
      buildSearchAndPagination({
        ...query
      })
    )
  }

  async addLogo(companyId, file, options = {}) {
    const { transaction = null } = options

    const company = await CompanyModel.findByPk(companyId, { transaction })

    if (!company) throw new Error('Comany not found')

    const { originalname: name, key, location: url } = file

    const image = {
      name,
      key,
      url: url || `http://localhost:3003/files/${key}`
    }

    const logo = await ImageModel.create(image, {
      transaction
    })

    await company.setLogo(logo, { transaction })

    return company
  }

  async removeLogo(companyId, options = {}) {
    const { transaction = null } = options

    const company = await CompanyModel.findByPk(companyId, { transaction })

    if (!company) throw new Error('Company not found')

    const logo = await ImageModel.findByPk(company.logoId, { transaction })

    if (!logo) throw new Error('logo not found')

    await company.update({ logoId: null }, { transaction })

    await logo.destroy({ force: true, transaction })

    return await this.getById(companyId, { transaction })
  }
}

module.exports = new CompanyDomain()
