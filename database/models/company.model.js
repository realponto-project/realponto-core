const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Company = (sequelize) => {
  const Company = sequelize.define('company', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('co_')
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    siteUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    document: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    passwordUserDefault: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '123456',
    },
    companyLogo: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    trialDays: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 7,
    },
    subscription: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowPdv: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowOrder: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  })

  Company.associate = (models) => {
    models.company.belongsTo(models.address, {
      foreignKey: {
        allowNull: true,
      }
    })
  }

  return Company
}

module.exports = Company
