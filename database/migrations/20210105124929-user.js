'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    birthday:  {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    document:  {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    firstAccess: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
  down: queryInterface => queryInterface.dropTable('users'),
}