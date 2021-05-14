const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAd = (sequelize) => {
  const MercadoLibreAd = sequelize.define('mercadoLibre_ad', {
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
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  MercadoLibreAd.associate = (models) => {
    models.mercadoLibre_ad.hasMany(models.mercadoLibre_accountAd, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return MercadoLibreAd
}

module.exports = MercadoLibreAd
