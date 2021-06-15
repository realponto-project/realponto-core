'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('mercado_libre_ad', 'parse_sku', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('mercado_libre_ad', 'parse_sku')
  }
}
