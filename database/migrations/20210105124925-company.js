'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('companies', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    siteUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    document: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    passwordUserDefault: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '123456',
    },
    companyLogo: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    trialDays: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 7,
    },
    subscription: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowPdv: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowOrder: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  down: queryInterface => queryInterface.dropTable('companies'),
}