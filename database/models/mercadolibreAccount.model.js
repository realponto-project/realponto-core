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
    seller_id: {
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
    },
    last_sync_ads: {
      type: Sequelize.DATE,
      allowNull: true
    }
  })

  MercadoLibreAccount.associate = (models) => {
    models.mercadoLibreAccount.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercadoLibreAccount.hasMany(models.mercadoLibreAd)
  }

  return MercadoLibreAccount
}

module.exports = MercadoLibreAccount
