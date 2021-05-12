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
    installment: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaulValue: 1
    },
    paymentMethod: {
      type: Sequelize.ENUM(['credit_card', 'boleto', 'cash', 'free']),
      allowNull: false,
      defaultValue: 'free'
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    tid: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    authorization_code: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    endDate: {
      type: Sequelize.DATE,
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
