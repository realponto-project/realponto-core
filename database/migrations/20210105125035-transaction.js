'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('transactions', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
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
    statusId: {
      type: Sequelize.STRING,
      references: {
        model: 'statuses',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    orderId: {
      type: Sequelize.STRING,
      references: {
        model: 'orders',
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
  down: (queryInterface) => queryInterface.dropTable('transactions')
};