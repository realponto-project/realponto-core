const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const CalcPrice = (sequelize) => {
  const CalcPrice = sequelize.define('calcPrice', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
      unique: 'compositeIndex',
      defaultValue: uuidv4Generator('calPr_')
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'compositeIndex'
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  CalcPrice.associate = (models) => {
    models.calcPrice.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return CalcPrice
}

module.exports = CalcPrice
