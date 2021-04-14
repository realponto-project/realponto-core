'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'plan',
      [
        {
          id: 'pl_3b9cacb1-731c-4296-bb14-2117c316eb51',
          activated: true,
          description: 'Anual',
          discount: 'OFF 25%',
          quantityProduct: 150,
          amount: 999,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pl_f941055e-1df7-4e6d-9d4d-698694b869fd',
          activated: true,
          description: 'Anual',
          discount: 'OFF 15%',
          quantityProduct: 300,
          amount: 1499,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pl_8362f8a4-5f91-4ede-90ce-30be60aeea67',
          activated: true,
          description: 'Anual',
          discount: '-',
          quantityProduct: 1000,
          amount: 1999,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pl_ecbb9b10-5821-4ab6-a490-67962c601af9',
          activated: true,
          description: 'Free',
          discount: 'free',
          quantityProduct: 30,
          amount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('plan', null, {})
}
