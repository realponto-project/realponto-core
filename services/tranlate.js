const translate = require('translate')

translate('Hello world', 'es')
  .then((resp) => console.log(resp))
  .catch((err) => console.err(err))
