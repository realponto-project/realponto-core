const { omit, path, pathOr, replace, pipe } = require('ramda')
const { hash } = require('bcrypt')

const database = require('../../database')
const { NotFoundError } = require('../../utils/helpers/errors')
const {
  UserUpdatePwdSchema,
  UserResetPwdSchema
} = require('../../utils/helpers/Schemas/User')
const buildPagination = require('../../utils/helpers/searchSpec')

const UserModel = database.model('user')
const CompanyModel = database.model('company')

const buildSearchAndPagination = buildPagination('user')

class UserDomain {
  async create(bodyData, options = {}) {
    const password = path(['password'], bodyData)
    const { transaction = null } = options
    const passwordHash = await hash(password, 10)
    const userCreated = await UserModel.create(
      { ...bodyData, password: passwordHash },
      {
        transaction
      }
    )

    return await UserModel.findByPk(userCreated.id, {
      include: [CompanyModel],
      transaction
    })
  }

  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    const companyId = path(['companyId'], bodyData)
    const document = pipe(
      pathOr('', ['document']),
      replace(/\W/g, '')
    )(bodyData)

    const user = await UserModel.findByPk(id, {
      where: { companyId }
    })

    if (!user) {
      throw new NotFoundError('user not found')
    }

    if (document) {
      const verifyDocument = await UserModel.findOne({
        where: { document, companyId }
      })

      if (verifyDocument && verifyDocument.id !== id) {
        throw new NotFoundError('user alredy exist with this document')
      }
    }

    if (bodyData.activated === false && user.activated === true) {
      const countUsersActived = await UserModel.count({
        where: {
          companyId,
          activated: true
        },
        raw: true,
        transaction
      })

      if (countUsersActived === 1) {
        throw new Error('Cannot inactivate all users')
      }
    }

    await user.update(omit(['password'], bodyData), { transaction })

    const userUpdated = await UserModel.findByPk(id, {
      where: { companyId },
      include: [CompanyModel],
      transaction
    })

    return userUpdated
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

    const password = await hash(bodyData.newPassword, 10)

    const checkedPassword = await user.checkPassword(bodyData.password)

    if (!checkedPassword) {
      throw new Error('Password do not match with password saved')
    }

    return await user.update({ password }, { transaction })
  }

  async resetPassword(id, bodyData, options = {}) {
    const { transaction = null } = options
    const companyId = path(['companyId'], bodyData)

    const user = await UserModel.findOne({
      where: { id, companyId, activated: true }
    })

    if (!user) {
      throw new NotFoundError('user not found')
    }

    await UserResetPwdSchema.validate(bodyData)

    const password = await hash(bodyData.newPassword, 10)

    return await user.update({ password }, { transaction })
  }

  async recoveryPassword(bodyData) {
    const email = pathOr('', ['email'], bodyData)
    const user = await UserModel.findOne({
      where: { email }
    })

    if (!user) {
      throw new NotFoundError('user not found')
    }

    return user
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
