'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'product',
      [
        {
          id: 'pr_0b0ca960-2034-4048-8bde-a879d34e6b81',
          name: 'Airpods apple com estojo de recarga',
          barCode: 'd32aw1d35wa1daw1d531aw3d1wa5d3aw',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pr_a05b313b-8731-4d0f-9935-cce735c2d34d',
          name: 'Apple watch series 3',
          barCode: '87d98q789e7q89w798aw7d897dwa98dw',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('product', null, {})
}
