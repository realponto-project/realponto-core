'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'plan',
      [
        {
          id: 'pl_f941055e-1df7-4e6d-9d4d-698694b869fd',
          activated: true,
          description: 'Anual',
          discount: '',
          quantityProduct: 1000,
          amount: 4499,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pl_8362f8a4-5f91-4ede-90ce-30be60aeea67',
          activated: true,
          description: 'Anual',
          discount: '-',
          quantityProduct: 300,
          amount: 2249,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pl_ecbb9b10-5821-4ab6-a490-67962c601af9',
          activated: true,
          description: 'Free',
          discount: 'free',
          quantityProduct: 300,
          amount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('plan', null, {})
}
