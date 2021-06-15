'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('mercado_libre_account_ad', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      item_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      type_sync: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mercado_libre_account_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'mercado_libre_account',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      mercado_libre_ad_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'mercado_libre_ad',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    }),
  down: (queryInterface) => queryInterface.dropTable('mercado_libre_account_ad')
}
