const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Plan = (sequelize) => {
  const Plan = sequelize.define('plan', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('pl_'),
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  })

  return Plan
}

module.exports = Plan
