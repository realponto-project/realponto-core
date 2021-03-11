const { factory } = require('factory-girl')
const database = require('../../database')
const AddressModel = database.model('address')
const CustomerModel = database.model('customer')
const { generatorFakerAddress } = require('./Faker/address')
const { generatorFakerCustomer } = require('./Faker/customer')

factory.define('address', AddressModel, generatorFakerAddress())
factory.define('customer', CustomerModel, {
  ...generatorFakerCustomer(),
  addressId: factory.assoc('address', 'id'),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
})

module.exports = factory
