const moment = require('moment')

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'subscription',
      [
        {
          id: 'sn_e394ceea-47b5-4dfa-bce9-0e58ebf82c66',
          activated: true,
          autoRenew: false,
          paymentMethod: 'credit_card',
          status: 'paid',
          amount: 11988,
          tid: null,
          authorization_code: true,
          startDate: new Date(),
          endDate: new Date(moment().add(1, 'year')),
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          planId: 'pl_ecbb9b10-5821-4ab6-a490-67962c601af9',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('subscription', null, {})
}
