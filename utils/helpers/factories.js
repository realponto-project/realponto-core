const { factory } = require('factory-girl')

const database = require('../../database')
const { generatorFakerAddress } = require('./Faker/address')
const { generatorFakerCustomer } = require('./Faker/customer')
const { generatorFakerUser } = require('./Faker/user')
const { fakerCompany, fakerStatus, fakerProduct } = require('./fakers')

const AddressModel = database.model('address')
const CompanyModel = database.model('company')
const CustomerModel = database.model('customer')
const ProductModel = database.model('product')
const StatusModel = database.model('status')
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
factory.define('company', CompanyModel, fakerCompany())
factory.define('status', StatusModel, {
  ...fakerStatus(),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
})
factory.define('product', ProductModel, {
  ...fakerProduct(),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
})
module.exports = factory
