const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const FakeBalance = (sequelize) => {
  const FakeBalance = sequelize.define('fakeBalance', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('fba_')
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  })

  FakeBalance.associate = (models) => {
    models.fakeBalance.belongsTo(models.product, {
      foreignKey: {
        allowNull: false
      }
    })

    models.order.belongsTo(models.status, {
      foreignKey: {
        allowNull: false
      }
    })

    models.fakeBalance.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return FakeBalance
}

module.exports = FakeBalance
