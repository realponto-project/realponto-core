'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logErrors', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      mercadoLibreAdId: {
        type: Sequelize.STRING,
        reference: {
          model: 'mercadolibreAd',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },

      department: Sequelize.STRING,

      cause_id: Sequelize.INTEGER,

      type: Sequelize.STRING,

      code: Sequelize.STRING,

      references: Sequelize.ARRAY(Sequelize.STRING),

      message: Sequelize.STRING,

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
    await queryInterface.dropTable('logErrors')
  }
}
