'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('plan', {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true
      },
      activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      quantityProduct: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
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
  down: (queryInterface) => queryInterface.dropTable('plan')
}
