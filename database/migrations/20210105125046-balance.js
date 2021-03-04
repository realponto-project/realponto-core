'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('balances', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    productId: {
      type: Sequelize.STRING,
      references: {
        model: 'products',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
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
  down: (queryInterface) => queryInterface.dropTable('balances')
}