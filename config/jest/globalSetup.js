const database = require('../../database')

const CompanyModel = database.model('company')
const StatusModel = database.model('status')
const UserModel = database.model('user')
const PlanModel = database.model('plan')

module.exports = async () => {
  await PlanModel.findOrCreate({
    where: {
      id: 'pl_ecbb9b10-5821-4ab6-a490-67962c601af9',
      activated: true,
      description: 'Free',
      discount: 'free',
      quantityProduct: 30,
      amount: 0
    }
  })
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
      value: 'initial_balance',
      label: 'Saldo inicial',
      color: '#17C9B2',
      type: 'inputs',
      typeLabel: 'Entrada',
      companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
    }
  })

  if (!(await UserModel.findByPk('us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c'))) {
    await UserModel.findOrCreate({
      where: {
        id: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
        activated: true,
        name: 'Alexandre Soares',
        email: 'alexandre_santos@hotmail.com',
        password:
          '$2b$10$5xUqXkUwblWquZumoLYSRuGUYHupV0Lir0z9M8gsTxA1uUwtGbONa',
        firstAccess: true,
        phone: '+55 11 970707070',
        badget:
          'cracha-alexandre-soares-us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
        companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
      }
    })
  }
}
