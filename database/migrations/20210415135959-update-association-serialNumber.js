'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('serialNumber', 'orderId', {
      type: Sequelize.STRING,
      allowNull: true
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('serialNumber', 'orderId', {
      type: Sequelize.STRING,
      allowNull: false
    })
}
