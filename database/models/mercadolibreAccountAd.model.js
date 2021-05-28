const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAccountAd = (sequelize) => {
  const MercadoLibreAccountAd = sequelize.define(
    'mercado_libre_account_ad',
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4Generator('acadml_')
      },
      item_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      type_sync: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
          'error'
        ]),
        allowNull: false,
        defaultValue: 'unupdated'
      }
    },
    {
      underscored: true
    }
  )

  MercadoLibreAccountAd.associate = (models) => {
    models.mercado_libre_account_ad.belongsTo(models.mercado_libre_account, {
      foreignKey: 'mercado_libre_account_id'
    })
    models.mercado_libre_account_ad.belongsTo(models.mercado_libre_ad, {
      foreignKey: 'mercado_libre_ad_id'
    })
  }

  return MercadoLibreAccountAd
}

module.exports = MercadoLibreAccountAd
