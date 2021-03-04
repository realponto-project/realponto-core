'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('addresses', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    neighborhood: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    streetNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    states: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    zipcode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    complementary: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: true,
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
  down: queryInterface => queryInterface.dropTable('addresses'),
}