const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Subscription = (sequelize) => {
  const Subscription = sequelize.define('subscription', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('sb_')
    },
    startDate: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date()
    },
    endDate: {
      allowNull: false,
      type: Sequelize.DATE
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    autoRenew: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    paymentMethod: {
      type: Sequelize.ENUM(['credit_card', 'boleto', 'cash']),
      allowNull: false,
      defaultValue: 'credit_card'
    },
    statusPayment: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  Subscription.associate = (models) => {
    models.subscription.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })

    models.subscription.belongsTo(models.plan, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Subscription
}

module.exports = Subscription
