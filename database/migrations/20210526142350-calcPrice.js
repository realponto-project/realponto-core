'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('calcPrice', {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        unique: 'compositeIndex'
      },
      activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'compositeIndex'
      },
      code: {
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
  down: (queryInterface) => queryInterface.dropTable('calcPrice')
}
