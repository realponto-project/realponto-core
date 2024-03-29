'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('company', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nickName: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      siteUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      document: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      passwordUserDefault: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '123456'
      },
      companyLogo: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      trialDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 7
      },
      allowPdv: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      allowOrder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      referer: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'alxa'
      },
      logoId: {
        type: Sequelize.STRING,
        references: {
          model: 'image',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      addressId: {
        type: Sequelize.STRING,
        references: {
          model: 'address',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict',
        allowNull: true
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
  down: (queryInterface) => queryInterface.dropTable('company')
}
