const database = require('../../database')

const changePriceModel = database.model('changePrice')
const MlAdModel = database.model('mercadoLibreAd')

class ChangePriceDomain {
  async getAll(mercadoLibreAdId) {
    const rows = await changePriceModel.findAll({
      include: MlAdModel,
      where: { mercadoLibreAdId }
    })

    return rows
  }
}

module.exports = new ChangePriceDomain()
