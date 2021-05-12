const faker = require('faker')
const moment = require('moment')
const cpf = require('@fnando/cpf/commonjs')
const cnpj = require('@fnando/cnpj/commonjs')

faker.locale = 'pt_BR'

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
    name: `${faker.commerce.product()} ${faker.random.number()}`,
    barCode: faker.random.uuid(),
    minQuantity: faker.random.number(),
    buyPrice: faker.random.number(),
    salePrice: faker.random.number()
  }
}

const fakerPlan = () => {
  return {
    activated: true,
    description: faker.lorem.word(),
    discount: faker.random.number(),
    quantityProduct: faker.random.number(),
    amount: faker.random.number(),
    totalAmount: faker.random.number()
  }
}

const fakerSubscription = () => {
  return {
    cardHash: faker.random.uuid(),
    planId: faker.random.uuid(),
    amount: faker.random.number(),
    startDate: moment(),
    endDate: moment().add(30, 'day'),
    status: 'free',
    activated: true,
    autoRenew: false,
    paymentMethod: 'cash',
    authorization_code: null
  }
}

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

const generatorFakerCustomer = () => ({
  name: faker.name.firstName(),
  socialName: faker.company.companyName(),
  document: cnpj.generate(),
  phone: faker.phone.phoneNumber()
})

const generatorFakerAddress = () => ({
  neighborhood: faker.address.county(),
  street: faker.address.streetName(),
  streetNumber: String(faker.random.number({ max: 1000 })),
  city: faker.address.city(),
  states: faker.address.state(),
  zipcode: faker.address.zipCode(),
  complementary: faker.lorem.words(),
  reference: faker.lorem.words()
})

const fakerAlxaProduct = () => {
  return {
    activated: faker.random.boolean(),
    name: `${faker.commerce.product()} ${faker.random.number()}`,
    salePrice: faker.random.number(),
    type: faker.commerce.product()
  }
}

module.exports = {
  generatorFakerAddress,
  generatorFakerCustomer,
  generatorFakerUser,
  fakerCompany,
  fakerPlan,
  fakerProduct,
  fakerStatus,
  fakerSubscription,
  fakerAlxaProduct
}
