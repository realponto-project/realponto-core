'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('products',
  [{
    id: 'pr_0b0ca960-2034-4048-8bde-a879d34e6b81',
    name: 'Airpods apple com estojo de recarga',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pr_a05b313b-8731-4d0f-9935-cce735c2d34d',
    name: 'Apple watch series 3',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
], {}),

  down: (queryInterface) => queryInterface.bulkDelete('products', null, {}),
}
