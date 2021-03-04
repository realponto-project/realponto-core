const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Address = (sequelize) => {
  const Address = sequelize.define('address', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('ad_')
    },
    neighborhood: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    streetNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    states: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    zipcode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    complementary: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })

  return Address
}

module.exports = Address
