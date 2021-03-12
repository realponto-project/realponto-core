const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const OrderProduct = (sequelize) => {
  const OrderProduct = sequelize.define('orderProduct', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('op_')
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    salePrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  })

  OrderProduct.associate = (models) => {
    models.orderProduct.belongsTo(models.product, {
      foreignKey: {
        allowNull: true
      }
    })

    models.orderProduct.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })

    models.orderProduct.belongsTo(models.status, {
      foreignKey: {
        allowNull: false
      }
    })

    models.orderProduct.belongsTo(models.order, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return OrderProduct
}

module.exports = OrderProduct
