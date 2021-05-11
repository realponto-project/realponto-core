'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('alxa_product', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salePrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
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
  down: (queryInterface) => queryInterface.dropTable('alxa_product')
}
