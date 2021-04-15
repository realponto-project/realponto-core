const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Order = (sequelize) => {
  const Order = sequelize.define('order', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('or_')
    },
    pendingReview: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    payment: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    originType: {
      type: Sequelize.ENUM(['order', 'pdv']),
      allowNull: false,
      defaultValue: 'order'
    },
    installments: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    orderDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    discount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  })

  Order.associate = (models) => {
    models.order.belongsTo(models.customer, {
      foreignKey: {
        allowNull: true
      }
    })

    models.order.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })

    models.order.belongsTo(models.user, {
      foreignKey: {
        allowNull: true
      }
    })

    models.order.belongsTo(models.status, {
      foreignKey: {
        allowNull: false
      }
    })

    models.order.hasMany(models.transaction, {
      foreignKey: {
        allowNull: false
      }
    })

    models.order.hasMany(models.serialNumber, {
      foreignKey: {
        allowNull: false
      }
    })

    models.order.hasMany(models.orderProduct, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Order
}

module.exports = Order
