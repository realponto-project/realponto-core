'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users',[{
    id: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    activated: true,
    name: 'Alexandre Soares',
    email: 'alexandre_santos@hotmail.com',
    password: '$2b$10$5xUqXkUwblWquZumoLYSRuGUYHupV0Lir0z9M8gsTxA1uUwtGbONa', // 123456
    firstAccess: true,
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),
  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
}
