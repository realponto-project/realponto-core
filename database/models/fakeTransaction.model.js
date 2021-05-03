const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const FakeTransaction = (sequelize) => {
  const FakeTransaction = sequelize.define('fakeTransaction', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('ftr_')
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })

  FakeTransaction.associate = (models) => {
    models.fakeTransaction.belongsTo(models.product, {
      foreignKey: {
        allowNull: false
      }
    })

    models.fakeTransaction.belongsTo(models.order, {
      foreignKey: {
        allowNull: false
      }
    })

    models.fakeTransaction.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      }
    })

    models.fakeTransaction.belongsTo(models.status, {
      foreignKey: {
        allowNull: false
      }
    })

    models.fakeTransaction.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return FakeTransaction
}

module.exports = FakeTransaction
