const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAccountAd = (sequelize) => {
  const MercadoLibreAccountAd = sequelize.define('mercadoLibreAccountAd', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('acadml_')
    },
    itemId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    typeSync: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  MercadoLibreAccountAd.associate = (models) => {
    models.mercadoLibreAccountAd.belongsTo(models.mercadoLibreAccount, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercadoLibreAccountAd.belongsTo(models.mercadoLibreAd, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return MercadoLibreAccountAd
}

module.exports = MercadoLibreAccountAd
