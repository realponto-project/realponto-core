const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Subscription = (sequelize) => {
  const Subscription = sequelize.define('subscription', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('sb_'),
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    salePrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  })

  Subscription.associate = (models) => {
    models.orderProduct.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Subscription
}

module.exports = Subscription
