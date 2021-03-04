'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('customers',
  [{
    id: 'co_93ac00e9-dc56-457b-ada0-f719679c0a6b',
    name: 'Company test development',
    document: '11222333000100',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    phone: '+55 11 96503-5205',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'co_4e4a1a5d-ab00-49f0-98a8-ec018543b3a3',
    name: 'Company test development 1',
    document: '11222333000101',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    phone: '+55 11 96503-5205',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'co_5525fa9a-9fcc-46f0-a99b-cf186d5ace58',
    name: 'Company test development 2',
    document: '11222333000102',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    phone: '+55 11 96503-5205',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'co_b7d1a40d-e832-4ac8-aa5a-96002d4f63fe',
    name: 'Company test development 3',
    document: '11222333000103',
    companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    phone: '+55 11 96503-5205',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
], {}),

  down: (queryInterface) => queryInterface.bulkDelete('customers', null, {}),
}
