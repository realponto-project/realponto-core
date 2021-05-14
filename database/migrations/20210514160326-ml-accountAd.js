'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('mercadoLibre_accountAd', {
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
      mercadoLibre_accountId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mercadoLibre_accountAdId: {
        type: Sequelize.STRING,
        allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('mercadoLibre_accountAd')
}
