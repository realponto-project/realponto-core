const Sequelize = require('sequelize')

const UploadService = require('../../services/upload')

const uuidv4Generator = require('../../utils/helpers/hash')

const ProductImage = (sequelize) => {
  const ProductImage = sequelize.define(
    'productImage',
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4Generator('pri_')
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      hooks: {
        afterDestroy(instance) {
          const uploadService = new UploadService()

          uploadService.destroyImage(instance.key)
        }
      }
    }
  )

  ProductImage.associate = (models) => {
    models.productImage.belongsTo(models.product, {
      foreignKey: {
        allowNull: true
      }
    })
  }

  return ProductImage
}

module.exports = ProductImage
