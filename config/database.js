require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

module.exports = {
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PWD,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    dialect: 'postgres',
    define: {
      freezeTableName: true,
      paranoid: true,
      timestamps: true
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PWD,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    dialect: 'postgres',
    define: {
      freezeTableName: true,
      paranoid: true,
      timestamps: true
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    protocol: 'postgres',
    url: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      freezeTableName: true,
      paranoid: true,
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}
