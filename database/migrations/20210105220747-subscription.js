'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('subscriptions', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    expiratedDate: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    startDate: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
    planId: {
      type: Sequelize.STRING,
      references: {
        model: 'plans',
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
  down: queryInterface => queryInterface.dropTable('subscriptions'),
}