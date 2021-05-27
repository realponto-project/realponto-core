const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAccount = (sequelize) => {
  const MercadoLibreAccount = sequelize.define(
    'mercado_libre_account',
    {
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
      },
      last_sync_ads: {
        type: Sequelize.DATE,
        allowNull: true
      }
    },
    {
      underscored: true
    }
  )

  MercadoLibreAccount.associate = (models) => {
    models.mercado_libre_account.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercado_libre_account.belongsToMany(models.mercado_libre_ad, {
      through: 'mercado_libre_account_ad'
    })
  }

  return MercadoLibreAccount
}

module.exports = MercadoLibreAccount
