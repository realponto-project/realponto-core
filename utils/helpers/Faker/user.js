const faker = require('faker')
const cpf = require('@fnando/cpf/commonjs')

faker.locale = 'pt_BR'

const generatorFakerUser = () => ({
  activated: faker.random.boolean(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  badget: String(faker.random.number()),
  birthday: faker.date.past(),
  document: cpf.generate(),
  password: faker.internet.password(),
  firstAccess: faker.random.boolean()
})

module.exports = {
  generatorFakerUser
}
