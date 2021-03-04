'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('balances',
  [{
    id: 'ba_31fbb5db-af7a-4554-bdf9-a81bd2b667ae',
    productId: 'pr_a05b313b-8731-4d0f-9935-cce735c2d34d',
    quantity: 10,
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ba_2cea22d2-d0ab-489a-9bee-ca503030621d',
    productId: 'pr_0b0ca960-2034-4048-8bde-a879d34e6b81',
    quantity: 10,
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

], {}),

  down: (queryInterface) => queryInterface.bulkDelete('balances', null, {}),
}
