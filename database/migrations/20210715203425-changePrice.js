'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('changePrice', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },

      newPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      oldPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      field: {
        type: Sequelize.ENUM(['price', 'price_ml']),
        allowNull: false
      },

      origin: {
        type: Sequelize.STRING,
        // type: Sequelize.ENUM(['alxa', 'notification']),
        allowNull: false
      },

      mercadoLibreAdId: {
        type: Sequelize.STRING,
        references: {
          model: 'mercadoLibreAd',
          key: 'id'
        },
        allowNull: true,
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
  down: (queryInterface) => queryInterface.dropTable('changePrice')
}
