const { concat } = require('ramda')
const uuidv4 = require('uuid/v4')
const uuidv4Generator = (prefix = '') => () => concat(prefix, uuidv4())

module.exports = uuidv4Generator
