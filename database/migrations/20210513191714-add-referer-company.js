'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('company', 'referer', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'alxa'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('company', 'referer')
  }
}
