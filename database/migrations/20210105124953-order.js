'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('order', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      pendingReview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      installments: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      shippingCompany: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      protocol: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      originType: {
        type: Sequelize.ENUM(['order', 'pdv']),
        allowNull: false,
        defaultValue: 'order'
      },
      orderDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
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
      customerId: {
        type: Sequelize.STRING,
        references: {
          model: 'customer',
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
  down: (queryInterface) => queryInterface.dropTable('order')
}
