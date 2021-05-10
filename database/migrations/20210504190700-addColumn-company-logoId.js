'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('company', 'logoId', {
      type: Sequelize.STRING,
      references: {
        model: 'image',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'restrict'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('company', 'logoId')
  }
}
