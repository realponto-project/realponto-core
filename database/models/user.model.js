const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

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
      defaultValue: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    birthday:  {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    document:  {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    firstAccess: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  })

  User.associate = (models) => {
    models.user.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return User
}

module.exports = User
