const faker = require('faker')
const cnpj = require('@fnando/cnpj/commonjs')

faker.locale = 'pt_BR'

const generatorFakerCustomer = () => ({
  name: faker.name.firstName(),
  socialName: faker.company.companyName(),
  document: cnpj.generate(),
  phone: faker.phone.phoneNumber()
})

module.exports = {
  generatorFakerCustomer
}
