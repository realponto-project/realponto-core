'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('subscription', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      autoRenew: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      paymentMethod: {
        type: Sequelize.ENUM(['credit_card', 'boleto', 'cash', 'free']),
        allowNull: false,
        defaultValue: 'free'
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tid: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      authorization_code: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
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
      planId: {
        type: Sequelize.STRING,
        references: {
          model: 'plan',
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
  down: (queryInterface) => queryInterface.dropTable('subscription')
}
