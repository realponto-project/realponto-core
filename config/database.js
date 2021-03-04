module.exports = {
  development: {
  "use_env_variable": "DATABASE_URL",
    dialectOptions: {
      ssl: true,
    },
  },
  test: {
  "use_env_variable": "DATABASE_URL",
    dialectOptions: {
      ssl: true,
    },
  },
  production: {
     "use_env_variable": "DATABASE_URL",
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
          require:true,
          rejectUnauthorized: false
      },
    },
  }
}
