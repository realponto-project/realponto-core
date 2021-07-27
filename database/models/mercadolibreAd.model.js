const { pathOr } = require('ramda')
const Sequelize = require('sequelize')

const uuidv4Generator = require('../../utils/helpers/hash')

const changePriceModelDefine = require('./changePrice.model')

const MercadoLibreAd = (sequelize) => {
  const changePriceModel = changePriceModelDefine(sequelize)

  const MercadoLibreAd = sequelize.define(
    'mercadoLibreAd',
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
          'unupdated_alxa',
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
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      hooks: {
        beforeSave: ({ dataValues, _previousDataValues }, options) => {
          const { transaction = null } = options

          if (dataValues.price !== _previousDataValues.price) {
            const values = {
              newPrice: Number(dataValues.price),
              oldPrice: _previousDataValues.price,
              field: 'price',
              origin: pathOr('', ['changePrice', 'origin'], options),
              mercadoLibreAdId: dataValues.id
            }
            changePriceModel.create(values, { transaction })
          }

          if (dataValues.price_ml !== _previousDataValues.price_ml) {
            const values = {
              newPrice: Number(dataValues.price),
              oldPrice: _previousDataValues.price,
              field: 'price_ml',
              origin: pathOr('', ['changePrice', 'origin'], options),
              mercadoLibreAdId: dataValues.id
            }
            changePriceModel.create(values, { transaction })
          }
        }
      }
    }
  )

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
