'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'alxa_product',
      [
        {
          id: 'axop_d41b6f14-db43-429a-9abc-4a1531ea1bc6',
          activated: true,
          description: '{"bonus":500}',
          type: 'credit_buy',
          name: '50.000 crédtos',
          salePrice: 5000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'axop_3036a506-b294-11eb-8529-0242ac130003',
          activated: true,
          description: '{"bonus":2500}',
          type: 'credit_buy',
          name: '100.000 crédtos',
          salePrice: 10000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'axop_38c9f6a0-b294-11eb-8529-0242ac130003',
          activated: true,
          description: '{"bonus":10000}',
          type: 'credit_buy',
          name: '500.000 crédtos',
          salePrice: 50000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('alxa_product', null, {})
  }
}
