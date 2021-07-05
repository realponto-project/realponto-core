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
    parse_sku: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },

    item_id: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    update_status: {
      type: Sequelize.ENUM([
        'updated',
        'unupdated',
        'waiting_update',
        'error',
        'not_update'
      ]),
      allowNull: false,
      defaultValue: 'unupdated'
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
      set(value) {
        this.setDataValue('price', value.toFixed(2))
      }
    },
    price_ml: {
      type: Sequelize.FLOAT
    }
  })

  MercadoLibreAd.associate = (models) => {
    models.mercadoLibreAd.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercadoLibreAd.belongsTo(models.mercadoLibreAccount)

    models.mercadoLibreAd.belongsToMany(models.logError, {
      through: 'mercadolibreAdLogErrors'
    })
  }

  return MercadoLibreAd
}

module.exports = MercadoLibreAd
