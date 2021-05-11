const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const AlxaProduct = (sequelize) => {
  const AlxaProduct = sequelize.define('alxa_product', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('axpr_')
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    salePrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  })

  return AlxaProduct
}

module.exports = AlxaProduct
