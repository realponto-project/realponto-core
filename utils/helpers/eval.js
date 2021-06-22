const R = require('ramda')

// eslint-disable-next-line no-eval
const evalString = (stringCode) => eval(stringCode)

module.exports = evalString
