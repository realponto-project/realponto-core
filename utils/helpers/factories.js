const { factory } = require('factory-girl')
const { random, date } = require('faker')

const database = require('../../database')
const {
  generatorFakerAddress,
  generatorFakerCustomer,
  generatorFakerUser,
  fakerCompany,
  fakerStatus,
  fakerProduct,
  fakerPlan
} = require('./fakers')

const AddressModel = database.model('address')
const CompanyModel = database.model('company')
const CustomerModel = database.model('customer')
const ProductModel = database.model('product')
const PlanModel = database.model('plan')
const StatusModel = database.model('status')
const UserModel = database.model('user')
const OrderModel = database.model('order')
const TransactionModel = database.model('transaction')

factory.define('user', UserModel, () => ({
  ...generatorFakerUser(),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
}))

factory.define('address', AddressModel, () => generatorFakerAddress())

factory.define('customer', CustomerModel, () => ({
  ...generatorFakerCustomer(),
  addressId: factory.assoc('address', 'id'),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
}))

factory.define('company', CompanyModel, () => fakerCompany())

factory.define('status', StatusModel, () => ({
  ...fakerStatus(),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
}))

factory.define('product', ProductModel, () => ({
  ...fakerProduct(),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
}))

factory.define('plan', PlanModel, () => fakerPlan())

factory.define('transaction', TransactionModel, () => ({
  quantity: 10,
  productId: factory.assoc('product', 'id'),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
  price: 0
}))

factory.define('order', OrderModel, () => ({
  pendingReview: false,
  statusId: factory.assoc('status', 'id', { fakeTransaction: false }),
  customerId: factory.assoc('customer', 'id'),
  userId: factory.assoc('user', 'id'),
  protocol: random.number(),
  orderDate: date.future(),
  companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
}))

module.exports = factory
