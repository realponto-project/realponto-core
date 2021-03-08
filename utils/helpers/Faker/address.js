const faker = require('faker')

faker.locale = 'pt_BR'

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

module.exports = {
  generatorFakerAddress
}
