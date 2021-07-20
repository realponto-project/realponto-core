const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const LogError = (sequelize) => {
  const LogError = sequelize.define('logError', {
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

    message: Sequelize.STRING,

    messagePt: Sequelize.STRING
  })

  // LogError.addHook('afterCreate', (logError, options) => {
  //   console.log('hook')
  //   console.log('logError', logError)
  //   console.log('options', options)
  //   // user.mood = 'happy'
  // })

  LogError.associate = (models) => {
    models.logError.belongsToMany(models.mercadoLibreAd, {
      through: 'mercadolibreAdLogError'
    })
  }

  return LogError
}

module.exports = LogError
