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
      companyId: {
        type: Sequelize.STRING,
        references: {
          model: 'company',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      mercadoLibre_accountId: {
        type: Sequelize.STRING,
        references: {
          model: 'mercadoLibre_account',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      mercadoLibre_adId: {
        type: Sequelize.STRING,
        references: {
          model: 'mercadoLibre_ad',
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
  down: (queryInterface) => queryInterface.dropTable('mercadoLibre_accountAd')
}
