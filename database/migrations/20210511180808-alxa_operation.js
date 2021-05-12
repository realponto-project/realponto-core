'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alxa_operation', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },

      details: {
        type: Sequelize.STRING(4096),
        allowNull: true
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false
      },

      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },

      companyId: {
        type: Sequelize.STRING,
        references: {
          model: 'company',
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
    await queryInterface.dropTable('alxa_operation')
  }
}
