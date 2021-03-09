const faker = require('faker')

const fakerStatus = () => {
  return {
    activated: faker.random.boolean(),
    label: faker.lorem.words(),
    value: faker.lorem.words(),
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
    document: String(faker.random.number()),
    siteUrl: faker.internet.url(),
    allowOrder: faker.random.boolean(),
    allowPdv: faker.random.boolean()
  }
}

const fakerProduct = () => {
  return {
    activated: faker.random.boolean(),
    name: faker.commerce.product(),
    barCode: faker.random.uuid(),
    minQuantity: faker.random.number(),
    buyPrice: faker.random.number(),
    salePrice: faker.random.number()
  }
}

module.exports = {
  fakerCompany,
  fakerProduct,
  fakerStatus
}
