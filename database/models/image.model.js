const Sequelize = require('sequelize')

const UploadService = require('../../services/upload')

const uuidv4Generator = require('../../utils/helpers/hash')

const Image = (sequelize) => {
  const Image = sequelize.define(
    'image',
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4Generator('img_')
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

  return Image
}

module.exports = Image
