'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('mercadoLibreAd', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('mercadoLibreAd', 'active')
  }
}
