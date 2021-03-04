const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = Express()
const baseUrl = '/api'

const { authenticationController } = require('./controllers/')
const authenticationRoutes = require('./routes/authentication')
const customerRoutes = require('./routes/customer')
const orderRoutes = require('./routes/order')
const productRoutes = require('./routes/product')
const statusRoutes = require('./routes/status')
const serialNumberRoutes = require('./routes/serialNumber')
const userRoutes = require('./routes/user')
const transactionRoutes = require('./routes/transaction')
const companyRoutes = require('./routes/company')
const registerRoutes = require('./routes/register')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(registerRoutes)
app.use('/auth', authenticationRoutes)
app.use(baseUrl, authenticationController.checkToken)
app.use(baseUrl, companyRoutes)
app.use(baseUrl, statusRoutes)
app.use(baseUrl, serialNumberRoutes)
app.use(baseUrl, transactionRoutes)
app.use(baseUrl, orderRoutes)
app.use(baseUrl, productRoutes)
app.use(baseUrl, userRoutes)
app.use(baseUrl, customerRoutes)

module.exports = app
