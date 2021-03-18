'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('status', {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true
      },
      activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(['inputs', 'outputs']),
        allowNull: false,
        defaultValue: 'inputs'
      },
      typeLabel: {
        type: Sequelize.ENUM(['Entrada', 'Saída']),
        allowNull: false
      },
      teste: {
        type: Sequelize.VIRTUAL,
        allowNull: true,
        unique: true
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
  down: (queryInterface) => queryInterface.dropTable('status')
}
