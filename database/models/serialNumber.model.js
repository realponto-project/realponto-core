const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const SerialNumber = (sequelize) => {
  const SerialNumber = sequelize.define('serialNumber', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuidv4Generator('sn_')
    },
    serialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    transactionInId: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    transactionOutId: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
  })

  SerialNumber.associate = (models) => {

    models.serialNumber.belongsTo(models.order, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.serialNumber.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.serialNumber.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.serialNumber.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return SerialNumber
}

module.exports = SerialNumber
