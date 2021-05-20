'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('mercadoLibreAccountAd', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      itemId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      typeSync: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
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
      mercadoLibreAdId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'mercadoLibreAd',
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
  down: (queryInterface) => queryInterface.dropTable('mercadoLibreAccountAd')
}
