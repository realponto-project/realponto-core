const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAccountAd = (sequelize) => {
  const MercadoLibreAccountAd = sequelize.define('mercadoLibre_accountAd', {
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
    }
  })

  MercadoLibreAccountAd.associate = (models) => {
    models.mercadoLibre_accountAd.belongsTo(models.mercadoLibre_account, {
      foreignKey: {
        allowNull: false
      }
    })
    models.mercadoLibre_accountAd.belongsTo(models.mercadoLibre_ad, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return MercadoLibreAccountAd
}

module.exports = MercadoLibreAccountAd
