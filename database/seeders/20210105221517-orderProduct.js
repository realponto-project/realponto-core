'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('orderProducts',
  [{
    id: 'op_2bf94e76-ecc8-465f-b8b0-0c395c4bd08e',
    quantity: 10,
    productName: 'Airpods apple com estojo de recarga',
    productId: 'pr_0b0ca960-2034-4048-8bde-a879d34e6b81',
    statusId:'st_dc093433-1fa0-409e-9c54-99488c3351fe',
    orderId: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'op_cb4051ed-44ae-477e-aa0a-88804122a291',
    quantity: 10,
    productName: 'Apple watch series 3',
    productId: 'pr_a05b313b-8731-4d0f-9935-cce735c2d34d',
    statusId: 'st_dcfa0308-227f-45f1-a7ac-cedfc22fd7a5',
    orderId: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

], {}),

  down: (queryInterface) => queryInterface.bulkDelete('orderProducts', null, {}),
}
