const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAccount = (sequelize) => {
  const MercadoLibreAccount = sequelize.define('mercadoLibreAccount', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('acml_')
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sellerId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    access_token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    refresh_token: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  MercadoLibreAccount.associate = (models) => {
    models.mercadoLibreAccount.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercadoLibreAccount.belongsToMany(models.mercadoLibreAd, {
      through: 'mercadoLibreAccountAd'
    })
  }

  return MercadoLibreAccount
}

module.exports = MercadoLibreAccount
