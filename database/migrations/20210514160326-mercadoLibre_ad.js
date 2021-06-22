'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mercadoLibreAd', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      sku: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      parse_sku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
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
      item_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      update_status: {
        type: Sequelize.ENUM([
          'updated',
          'unupdated',
          'waiting_update',
          'error'
        ]),
        allowNull: false,
        defaultValue: 'unupdated'
      },
      mercadoLibreAccountId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'mercadoLibreAccount',
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
    await queryInterface.dropTable('mercadoLibreAd')
  }
}
