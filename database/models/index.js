const Product = require('./product.model')
const Order = require('./order.model')
const Transaction = require('./transaction.model')
const FakeTransaction = require('./fakeTransaction.model')
const Customer = require('./customer.model')
const User = require('./user.model')
const SerialNumber = require('./serialNumber.model')
const Status = require('./status.model')
const OrderProduct = require('./orderProduct.model')
const Company = require('./company.model')
const Plan = require('./plan.model')
const Subscription = require('./subscription.model')
const Address = require('./address.model')
const ProductImage = require('./productImage.model')

module.exports = [
  Address,
  Product,
  Transaction,
  FakeTransaction,
  Order,
  Customer,
  User,
  SerialNumber,
  Status,
  OrderProduct,
  Company,
  Plan,
  Subscription,
  ProductImage
]
