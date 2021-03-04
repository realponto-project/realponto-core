'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('orderProducts', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
    salePrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
  down: (queryInterface) => queryInterface.dropTable('orderProducts')
};