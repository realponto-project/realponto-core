require('dotenv').config({})

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
    }
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialectOptions: {
      ssl: true
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
