const { concat } = require('ramda')
const { v4: uuidv4 } = require('uuid')
const uuidv4Generator = (prefix = '') => () => concat(prefix, uuidv4())

module.exports = uuidv4Generator
