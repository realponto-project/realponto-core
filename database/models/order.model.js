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
    protocol: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    pendingReview: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    transportadora: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    payment: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    note: {
      type: Sequelize.STRING,
      allowNull: true
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
      allowNull: false
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
        allowNull: true
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
