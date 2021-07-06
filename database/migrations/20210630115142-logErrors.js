'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logError', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      department: Sequelize.STRING,

      cause_id: Sequelize.INTEGER,

      type: Sequelize.STRING,

      code: Sequelize.STRING,

      references: Sequelize.ARRAY(Sequelize.STRING),

      message: Sequelize.STRING,

      messagePt: Sequelize.STRING,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('logError')
  }
}
