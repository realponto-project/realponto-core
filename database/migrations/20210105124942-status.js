'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('statuses', {
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
    label: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM(['inputs', 'outputs']),
      allowNull: false,
      defaultValue: 'inputs',
    },
    typeLabel: {
      type: Sequelize.ENUM(['Entrada', 'Saída']),
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
  down: queryInterface => queryInterface.dropTable('statuses'),
}