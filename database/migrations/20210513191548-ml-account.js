'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('mercadoLibreAccount', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      refresh_token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_sync_ads: {
        type: Sequelize.DATE,
        allowNull: true
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
    }),
  down: (queryInterface) => queryInterface.dropTable('mercadoLibreAccount')
}
