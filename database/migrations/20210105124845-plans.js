'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('plans', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
  }),
  down: queryInterface => queryInterface.dropTable('plans'),
}