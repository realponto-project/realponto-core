'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('orders',
  [{
    id: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
    statusId: 'st_dc093433-1fa0-409e-9c54-99488c3351fe',
    pendingReview: false,
    userId: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    customerId: 'co_93ac00e9-dc56-457b-ada0-f719679c0a6b',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'or_479d7ec6-5897-457a-9967-693b8efceb7c',
    statusId: 'st_dc093433-1fa0-409e-9c54-99488c3351fe',
    pendingReview: true,
    userId: null,
    customerId:  null,
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
], {}),

  down: (queryInterface) => queryInterface.bulkDelete('orders', null, {}),
}
