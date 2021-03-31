const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Customer = (sequelize) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('cu_')
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    socialName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    document: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    }
  })

  Customer.associate = (models) => {
    models.customer.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })

    models.customer.belongsTo(models.address, {
      foreignKey: {
        allowNull: true
      }
    })
  }

  return Customer
}

module.exports = Customer
