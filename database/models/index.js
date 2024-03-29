const Address = require('./address.model')
const CalcPrice = require('./calcPrice.model')
const ChangePrice = require('./changePrice.model')
const Company = require('./company.model')
const Customer = require('./customer.model')
const FakeTransaction = require('./fakeTransaction.model')
const Image = require('./image.model')
const LogError = require('./logError.model')
const MercadolibreAdLogErrors = require('./mercadolibreAdLogErrors.model')
const MercadoLibreAccount = require('./mercadolibreAccount.model')
const MercadolibreAd = require('./mercadolibreAd.model')
const Order = require('./order.model')
const OrderProduct = require('./orderProduct.model')
const Plan = require('./plan.model')
const Product = require('./product.model')
const ProductImage = require('./productImage.model')
const SerialNumber = require('./serialNumber.model')
const Status = require('./status.model')
const Subscription = require('./subscription.model')
const Transaction = require('./transaction.model')
const User = require('./user.model')

module.exports = [
  Address,
  CalcPrice,
  ChangePrice,
  Company,
  Customer,
  FakeTransaction,
  Image,
  LogError,
  MercadolibreAdLogErrors,
  MercadoLibreAccount,
  MercadolibreAd,
  Order,
  OrderProduct,
  Plan,
  Product,
  ProductImage,
  SerialNumber,
  Status,
  Subscription,
  Transaction,
  User
]
