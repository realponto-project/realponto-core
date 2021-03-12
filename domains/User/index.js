const { omit } = require('ramda')

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

    return UserModel.findByPk(userCreated.id, {
      include: [CompanyModel]
    })
  }

  async update(id, companyId, bodyData, options = {}) {
    const { transaction = null } = options

    const user = await UserModel.findByPk(id, {
      where: { companyId }
    })

    if (!user) {
      throw new NotFoundError('user not found')
    }

    await user.update(omit(['password'], bodyData), { transaction })

    return UserModel.findByPk(id, {
      where: { companyId },
      include: [CompanyModel]
    })
  }

  async updatePassword(id, companyId, bodyData, options = {}) {
    const { transaction = null } = options

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

    return UserModel.findByPk(id, {
      where: { companyId },
      include: [CompanyModel]
    })
  }

  async getById(id, companyId) {
    return await UserModel.findByPk(id, {
      where: { companyId },
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
