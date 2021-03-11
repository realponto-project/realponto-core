const { factory } = require('factory-girl')

const database = require('../../database')
const { generatorFakerAddress } = require('./Faker/address')
const { generatorFakerCustomer } = require('./Faker/customer')
const { generatorFakerUser } = require('./Faker/user')

const AddressModel = database.model('address')
const CustomerModel = database.model('customer')
const UserModel = database.model('user')

factory.define('user', UserModel, {
  ...generatorFakerUser(),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
})

factory.define('address', AddressModel, generatorFakerAddress())

factory.define('customer', CustomerModel, {
  ...generatorFakerCustomer(),
  addressId: factory.assoc('address', 'id'),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
})

module.exports = factory
