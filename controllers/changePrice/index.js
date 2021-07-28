const { pathOr } = require('ramda')

const changePriceDomain = require('../../domains/changePrice')

const getAllChangePrice = async (req, res, next) => {
  const mercadoLibreAdId = pathOr('', ['query', 'mercadoLibreAdId'], req)

  try {
    const response = await changePriceDomain.getAll(mercadoLibreAdId)

    res.json(response)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllChangePrice
}
