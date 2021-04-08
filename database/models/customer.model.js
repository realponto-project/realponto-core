const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')
const { isValid: isValidCpf } = require('@fnando/cpf')
const { isValid: isValidCnpj } = require('@fnando/cnpj')
const { isEmpty, replace } = require('ramda')

const Customer = (sequelize) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('cu_')
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    socialName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    document: {
      type: Sequelize.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue('document', replace(/\D/g, '', value))
      },
      validate: {
        isCpfOrCnpj(value) {
          if (!isEmpty(value) && !isValidCnpj(value) && !isValidCpf(value)) {
            throw new Error('Value is not cpnj nor cpf')
          }
        }
      }
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    }
  })

  Customer.associate = (models) => {
    models.customer.belongsTo(models.company, {
      foreignKey: {
        allowNull: false
      }
    })

    models.customer.belongsTo(models.address, {
      foreignKey: {
        allowNull: true
      }
    })
  }

  return Customer
}

module.exports = Customer
