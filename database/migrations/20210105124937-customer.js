'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('customers', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    document: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    addressId: {
      type: Sequelize.STRING,
      references: {
        model: 'addresses',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
      allowNull: true,
    },
    companyId: {
      type: Sequelize.STRING,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('customers'),
}