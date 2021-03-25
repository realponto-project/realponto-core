'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'plan',
      [
        {
          id: 'pl_8362f8a4-5f91-4ede-90ce-30be60aeea67',
          activated: true,
          description: 'Mensal',
          discount: '-',
          quantityProduct: 75,
          amount: 999,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pl_f941055e-1df7-4e6d-9d4d-698694b869fd',
          activated: true,
          description: 'Semestral',
          discount: 'OFF 15%',
          quantityProduct: 12,
          amount: 716,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'pl_3b9cacb1-731c-4296-bb14-2117c316eb51',
          activated: true,
          description: 'Anual',
          discount: 'OFF 25%',
          quantityProduct: 138,
          amount: 683,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('plan', null, {})
}
