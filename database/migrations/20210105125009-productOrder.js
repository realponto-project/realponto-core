'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('orderProduct', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      orderId: {
        type: Sequelize.STRING,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      salePrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      statusId: {
        type: Sequelize.STRING,
        references: {
          model: 'status',
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
  down: (queryInterface) => queryInterface.dropTable('orderProduct')
}
