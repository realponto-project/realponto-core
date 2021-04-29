const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

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
        afterDestroy(instance, options) {
          console.log(instance, options)
          if (process.env.STORAGE_TYPE === 's3') {
            // return s3
            // 	.deleteObject({
            // 		Bucket: process.env.BUCKET_NAME,
            // 		Key: this.key
            // 	})
            // 	.promise()
            // 	.then(response => {
            // 		console.log(response.status);
            // 	})
            // 	.catch(response => {
            // 		console.log(response.status);
            // 	});
          } else {
            return promisify(fs.unlink)(
              path.resolve(
                __dirname,
                '..',
                '..',
                'tmp',
                'uploads',
                instance.key
              )
            )
          }
          // Do other stuff
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
