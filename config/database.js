require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

module.exports = {
  development: {
    host: 'localhost',
    port: 5432,
    password: 'postgres',
    username: 'postgres',
    database: 'realponto-core-postgres',
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
    // dialect: 'sqlite',
    // storage: './database/database-test.sqlite',
    host: 'localhost',
    port: 5430,
    password: 'postgres',
    username: 'postgres',
    database: 'realponto-core-postgres-test',
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
