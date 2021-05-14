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
    fullname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sellerId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  })

  MercadoLibreAccount.associate = (models) => {
    models.mercadoLibre_account.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return MercadoLibreAccount
}

module.exports = MercadoLibreAccount
