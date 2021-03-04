const Sequelize = require('sequelize')
const Models = require('./models')

const { DB_USERNAME, DB_HOST, DB_DATABASE, DB_PWD, DB_PORT } = process.env

let sequelize = null
const { DATABASE_URL } = process.env

if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
} else {
  sequelize = new Sequelize({
    host: DB_HOST,
    port: DB_PORT,
    password: DB_PWD,
    username: DB_USERNAME,
    database: DB_DATABASE,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true,
      paranoid: true,
      timestamps: true
    }
  })
}

const ModelInstances = Models.map((model) => model(sequelize))
// sequelize.sync({ force: true })
ModelInstances.forEach(
  (modelInstance) =>
    modelInstance.associate && modelInstance.associate(sequelize.models)
)

module.exports = sequelize
