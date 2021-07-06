'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mercadolibreAdLogErrors', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      logErrorId: {
        type: Sequelize.STRING,
        reference: {
          model: 'logError',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
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
    await queryInterface.dropTable('mercadolibreAdLogErrors')
  }
}
