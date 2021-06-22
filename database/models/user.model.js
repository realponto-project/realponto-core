const Sequelize = require('sequelize')
const { compare } = require('bcrypt')
const uuidv4Generator = require('../../utils/helpers/hash')
const { replace } = require('ramda')

const User = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: uuidv4Generator('us_')
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      set(value) {
        this.setDataValue('phone', replace(/\D/g, '', value || ''))
      }
    },
    badget: {
      type: Sequelize.STRING,
      allowNull: true
    },
    birthday: {
      type: Sequelize.DATE,
      allowNull: true
    },
    document: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      set(value) {
        this.setDataValue('document', replace(/\W/g, '', value || ''))
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstAccess: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })

  User.prototype.checkPassword = async function (password) {
    return compare(password, this.password)
  }

  User.associate = (models) => {
    models.user.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return User
}

module.exports = User
