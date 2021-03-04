'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('products', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    minQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    buyPrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    salePrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    companyId: {
      type: Sequelize.STRING,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
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
  down: queryInterface => queryInterface.dropTable('products'),
}
