const { omit, path } = require('ramda')

const database = require('../../database')
const { NotFoundError } = require('../../utils/helpers/errors')
const { UserUpdatePwdSchema } = require('../../utils/helpers/Schemas/User')
const buildPagination = require('../../utils/helpers/searchSpec')

const UserModel = database.model('user')
const CompanyModel = database.model('company')

const buildSearchAndPagination = buildPagination('user')

class UserDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    const userCreated = await UserModel.create(bodyData, {
      transaction
    })

    return await UserModel.findByPk(userCreated.id, {
      include: [CompanyModel],
      transaction
    })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    const companyId = path(['companyId'], bodyData)

    const user = await UserModel.findByPk(id, {
      where: { companyId }
    })

    if (!user) {
      throw new NotFoundError('user not found')
    }

    await user.update(omit(['password'], bodyData), { transaction })

    await user.reload()

    return await UserModel.findByPk(id, {
      where: { companyId },
      include: [CompanyModel],
      transaction
    })
  }

  async updatePassword(id, bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = path(['companyId'], bodyData)

    const user = await UserModel.findOne({
      where: { id, companyId, activated: true }
    })

    if (!user) {
      throw new NotFoundError('user not found')
    }

    await UserUpdatePwdSchema.validate(bodyData)

    const checkedPassword = await user.checkPassword(bodyData.password)

    if (!checkedPassword) {
      throw new Error('Password do not match with password saved')
    }

    await user.update({ password: bodyData.newPassword }, { transaction })

    await user.reload()

    return await UserModel.findByPk(id, {
      where: { companyId },
      include: [CompanyModel],
      transaction
    })
  }

  async getById(id, companyId) {
    return await UserModel.findOne({
      where: { id, companyId },
      include: [CompanyModel]
    })
  }

  async getAll(query, companyId) {
    return await UserModel.findAndCountAll(
      buildSearchAndPagination({
        ...query,
        companyId
      })
    )
  }
}

module.exports = new UserDomain()
