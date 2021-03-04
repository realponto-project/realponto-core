const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Balance = (sequelize) => {
  const Balance = sequelize.define('balance', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('ba_')
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  })

  Balance.associate = (models) => {
    models.balance.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.balance.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Balance
}

module.exports = Balance
