'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('productImage', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'product',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('productImage')
  }
}
