'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('mercadoLibreAd', 'shippingCost', {
      type: Sequelize.FLOAT
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('mercadoLibreAd', 'shippingCost')
  }
}
