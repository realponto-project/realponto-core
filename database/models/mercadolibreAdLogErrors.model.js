const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const MercadolibreAdLogErrors = (sequelize) => {
  const MercadolibreAdLogErrors = sequelize.define('mercadolibreAdLogErrors', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: uuidv4Generator('adLogEr_')
    }
  })

  MercadolibreAdLogErrors.associate = (models) => {
    models.mercadolibreAdLogErrors.belongsTo(models.logError)
    models.mercadolibreAdLogErrors.belongsTo(models.mercadoLibreAd)
  }

  return MercadolibreAdLogErrors
}

module.exports = MercadolibreAdLogErrors
