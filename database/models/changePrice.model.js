const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const ChangePrice = (sequelize) => {
  const ChangePrice = sequelize.define('changePrice', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: uuidv4Generator('chngPr_')
    },

    newPrice: {
      type: Sequelize.FLOAT,
      allowNull: false
    },

    oldPrice: {
      type: Sequelize.FLOAT,
      allowNull: false
    },

    field: {
      type: Sequelize.ENUM(['price', 'price_ml']),
      allowNull: false
    },

    origin: {
      type: Sequelize.STRING,
      // type: Sequelize.ENUM(['alxa', 'notification']),
      allowNull: false
    }
  })

  ChangePrice.associate = (models) => {
    models.changePrice.belongsTo(models.mercadoLibreAd, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return ChangePrice
}

module.exports = ChangePrice
