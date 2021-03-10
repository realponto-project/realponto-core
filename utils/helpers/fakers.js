const faker = require('faker')

const fakerStatus = () => {
  return {
    activated: faker.random.boolean(),
    label: faker.lorem.word(),
    value: faker.lorem.word(),
    color: faker.internet.color(),
    type: faker.random.boolean() ? 'inputs' : 'outputs',
    typeLabel: faker.random.boolean() ? 'Entrada' : 'Saída',
    fakeTransaction: faker.random.boolean()
  }
}

const fakerCompany = () => {
  return {
    name: faker.lorem.word(),
    fullname: faker.lorem.word(),
    document: faker.random.number(),
    siteUrl: faker.internet.url(),
    allowOrder: faker.random.boolean(),
    allowPdv: faker.random.boolean()
  }
}

module.exports = {
  fakerCompany,
  fakerStatus
}
