const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadoLibreAccount = (sequelize) => {
  const MercadoLibreAccount = sequelize.define('mercadoLibre_account', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('acml_')
    },
    clientId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    clientSecret: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sellerId: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  })

  MercadoLibreAccount.associate = (models) => {
    models.mercadoLibre_account.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })

    models.mercadoLibre_account.belongsToMany(models.mercadoLibre_accountAd, {
      foreignKey: {
        allowNull: false
      },
      through: 'mercadoLibre_accountAd'
    })
  }

  return MercadoLibreAccount
}

module.exports = MercadoLibreAccount
