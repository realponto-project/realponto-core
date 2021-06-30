const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const LogErrors = (sequelize) => {
  const LogErrors = sequelize.define('logErrors', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: uuidv4Generator('logEr_')
    },

    department: Sequelize.STRING,

    cause_id: Sequelize.INTEGER,

    type: Sequelize.STRING,

    code: Sequelize.STRING,

    references: Sequelize.ARRAY(Sequelize.STRING),

    message: Sequelize.STRING
  })

  LogErrors.associate = (models) => {
    models.logErrors.belongsTo(models.mercadoLibreAd)
  }

  return LogErrors
}

module.exports = LogErrors
