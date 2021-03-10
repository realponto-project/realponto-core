const Sequelize = require('sequelize')
const { compare, hash } = require('bcrypt')
const uuidv4Generator = require('../../utils/helpers/hash')

const User = (sequelize) => {
  const User = sequelize.define(
    'user',
    {
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
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      badget: {
        type: Sequelize.STRING,
        allowNull: true
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: false
      },
      document: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
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
    },

    {
      hooks: {
        beforeSave: async (user) => {
          if (user.password) {
            user.password = await hash(user.password, 10)
          }
        }
      }
    }
  )

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
