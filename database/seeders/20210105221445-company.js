'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('companies',[{
    id: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
    name: 'Company fullname ltda',
    fullname: 'Fullname company social name ltda',
    document: '43947321821',
    siteUrl: 'www.mycompany.com.br',
    allowOrder: true,
    allowPdv: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),
  down: (queryInterface) => queryInterface.bulkDelete('companies', null, {}),
}
