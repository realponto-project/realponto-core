'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('serialNumber', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      serialNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      transactionInId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transactionOutId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      orderId: {
        type: Sequelize.STRING,
        references: {
          model: 'order',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      productId: {
        type: Sequelize.STRING,
        references: {
          model: 'product',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
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
  down: (queryInterface) => queryInterface.dropTable('serialNumber')
}
