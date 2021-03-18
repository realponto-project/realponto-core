const faker = require('faker')

const fakerStatus = () => {
  const response = {
    activated: faker.random.boolean(),
    label: faker.lorem.words(),
    value: faker.lorem.words(),
    color: faker.internet.color(),
    type: faker.random.boolean() ? 'inputs' : 'outputs',
    typeLabel: faker.random.boolean() ? 'Entrada' : 'Saída'
  }
  return response
}

const fakerCompany = () => {
  const response = {
    name: faker.name.firstName(),
    fullname: faker.company.companyName(),
    document: String(faker.random.number()),
    siteUrl: faker.internet.url(),
    allowOrder: faker.random.boolean(),
    allowPdv: faker.random.boolean()
  }

  return response
}

const fakerProduct = () => {
  return {
    balance: 0,
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
