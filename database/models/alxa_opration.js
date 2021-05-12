const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const AlxaOperation = (sequelize) => {
  const AlxaOperation = sequelize.define('alxa_operation', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('axop_')
    },

    details: {
      type: Sequelize.STRING(4096),
      allowNull: true
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false
    },

    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })

  AlxaOperation.associate = (models) => {
    models.alxa_operation.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      }
    })
    models.alxa_operation.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return AlxaOperation
}

module.exports = AlxaOperation
