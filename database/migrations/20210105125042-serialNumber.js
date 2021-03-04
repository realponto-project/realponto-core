'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('serialNumbers', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    serialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    transactionInId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    transactionOutId: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
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
  down: (queryInterface) => queryInterface.dropTable('serialNumbers')
}