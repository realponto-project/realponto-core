'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('product', {
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
      balance: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      barCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      minQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      buyPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      salePrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
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
  down: (queryInterface) => queryInterface.dropTable('product')
}
