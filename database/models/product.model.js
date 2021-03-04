const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Product = (sequelize) => {
  const Product = sequelize.define('product', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('pr_'),
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    minQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    buyPrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    salePrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  })

  Product.associate = (models) => {
    models.product.hasMany(models.serialNumber, {
      foreignKey: {
        allowNull: true,
      }
    })

    models.product.hasMany(models.transaction, {
      foreignKey: {
        allowNull: true,
      }
    })

    models.product.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.product.hasMany(models.balance, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Product
}

module.exports = Product
