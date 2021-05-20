const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAd = (sequelize) => {
  const MercadoLibreAd = sequelize.define('mercadoLibreAd', {
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
  })

  MercadoLibreAd.associate = (models) => {
    models.mercadoLibreAd.hasMany(models.mercadoLibreAccountAd, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercadoLibreAd.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercadoLibreAd.belongsToMany(models.mercadoLibreAccount, {
      through: 'mercadoLibreAccountAd'
    })
  }

  return MercadoLibreAd
}

module.exports = MercadoLibreAd
