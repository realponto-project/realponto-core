const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAd = (sequelize) => {
  const MercadoLibreAd = sequelize.define(
    'mercado_libre_ad',
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4Generator('adacml_')
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  )

  MercadoLibreAd.associate = (models) => {
    models.mercado_libre_ad.hasMany(models.mercado_libre_account_ad, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercado_libre_ad.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercado_libre_ad.belongsToMany(models.mercado_libre_account, {
      through: 'mercado_libre_account_ad'
    })
  }

  return MercadoLibreAd
}

module.exports = MercadoLibreAd
