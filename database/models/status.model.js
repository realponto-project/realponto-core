const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Status = (sequelize) => {
  const Status = sequelize.define('status', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: uuidv4Generator('st_')
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM(['inputs', 'outputs']),
      allowNull: false,
      defaultValue: 'inputs',
    },
    typeLabel: {
      type: Sequelize.ENUM(['Entrada', 'Saída']),
      allowNull: false,
    },
  })

  Status.associate = (models) => {
    models.status.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Status
}

module.exports = Status
