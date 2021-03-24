'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('subscription', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
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
        type: Sequelize.ENUM(['credit_card', 'boleto', 'cash']),
        allowNull: false,
        defaultValue: 'credit_card'
      },
      statusPayment: {
        type: Sequelize.STRING,
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
