'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('company', 'nickName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      unique: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('company', 'nickName')
  }
}
