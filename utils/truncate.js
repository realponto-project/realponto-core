const database = require('../database')

module.exports = () => {
  return Promise.all(
    Object.keys(database.models).map(
      (key) =>
        key !== 'company' &&
        database.models[key].destroy({ truncate: true, force: true })
    )
  )
}
