const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Product = (sequelize) => {
  const Product = sequelize.define('product', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('pr_')
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    barCode: {
      type: Sequelize.STRING,
      allowNull: true
    },
    minQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true
    },
    buyPrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    salePrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  })

  Product.associate = (models) => {
    models.product.hasMany(models.serialNumber, {
      foreignKey: {
        allowNull: true
      }
    })

    models.product.hasMany(models.productImage)

    models.product.hasMany(models.transaction, {
      foreignKey: {
        allowNull: true
      }
    })

    models.product.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Product
}

module.exports = Product
