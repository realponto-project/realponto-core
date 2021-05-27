'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('mercado_libre_account', 'last_sync_ads', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('mercado_libre_account', 'last_sync_ads')
  }
}
