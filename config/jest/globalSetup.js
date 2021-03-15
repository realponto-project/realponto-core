const database = require('../../database')

const CompanyModel = database.model('company')
const StatusModel = database.model('status')

module.exports = async () => {
  await CompanyModel.findOrCreate({
    where: {
      id: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
      name: 'Company fullname ltda',
      fullname: 'Fullname company social name ltda',
      document: '43947321821',
      siteUrl: 'www.mycompany.com.br',
      allowOrder: true,
      allowPdv: false
    }
  })
  await CompanyModel.findOrCreate({
    where: {
      id: 'co_5eb458ca-3466-4c89-99d2-e9ae57c0c362',
      name: 'Company JLC',
      fullname: 'Fullname company social JLC ltda',
      document: '46700988888',
      siteUrl: 'www.jlc.com.br',
      allowOrder: true,
      allowPdv: false
    }
  })
  await StatusModel.findOrCreate({
    where: {
      id: 'st_5ea743dc-d9fb-4960-9f3c-493f05b99c8e',
      label: 'initial_balance',
      value: 'Saldo inicial',
      color: '#D588F2',
      type: 'outputs',
      typeLabel: 'Saída',
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    }
  })
}
