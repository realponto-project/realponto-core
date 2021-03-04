'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('serialNumbers',
  [{
    id: 'sn_e394ceea-47b5-4dfa-bce9-0e58ebf82c66',
    productId: 'pr_0b0ca960-2034-4048-8bde-a879d34e6b81',
    orderId: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
    transactionInId: 'td_a0a703ec-b6c6-4064-afa5-6f2d6dd16e56',
    serialNumber: '0987654321',
    userId: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sn_edb9ca94-b62f-4019-b0f1-90b7645aa3ab',
    productId: 'pr_0b0ca960-2034-4048-8bde-a879d34e6b81',
    orderId: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
    transactionInId: 'td_a0a703ec-b6c6-4064-afa5-6f2d6dd16e56',
    serialNumber: '1234567890',
    userId: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

], {}),

  down: (queryInterface) => queryInterface.bulkDelete('serialNumbers', null, {}),
}
