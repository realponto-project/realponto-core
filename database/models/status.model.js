const Sequelize = require('sequelize')
const { concat } = require('ramda')
const uuidv4Generator = require('../../utils/helpers/hash')

const Status = (sequelize) => {
  const Status = sequelize.define(
    'status',
    {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: uuidv4Generator('st_')
      },
      activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(['inputs', 'outputs']),
        allowNull: false,
        defaultValue: 'inputs'
      },
      typeLabel: {
        type: Sequelize.ENUM(['Entrada', 'Saída']),
        allowNull: false
      },
      concatStatus: {
        type: Sequelize.VIRTUAL,
        allowNull: true,
        unique: true
      }
    },
    {
      hooks: {
        beforeSave: (status) => {
          status.concatStatus = concat(
            status.companyId,
            status.value,
            status.label
          )
        }
      }
    }
  )

  Status.associate = (models) => {
    models.status.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Status
}

module.exports = Status
