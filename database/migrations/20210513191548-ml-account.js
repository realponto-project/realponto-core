'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('mercado_libre_account', {
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
      company_id: {
        type: Sequelize.STRING,
        references: {
          model: 'company',
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
  down: (queryInterface) => queryInterface.dropTable('mercado_libre_account')
}
