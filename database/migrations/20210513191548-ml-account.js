'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('mercadoLibre_account', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      clientId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      clientSecret: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sellerId: {
        type: Sequelize.INTEGER,
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
  down: (queryInterface) => queryInterface.dropTable('mercadoLibre_account')
}
