'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'mercado_libre_account_ad',
      'update_status',
      {
        type: Sequelize.ENUM([
          'updated',
          'unupdated',
          'waiting_update',
          'error'
        ]),
        allowNull: false,
        defaultValue: 'unupdated'
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'mercado_libre_account_ad',
      'update_status'
    )
  }
}
