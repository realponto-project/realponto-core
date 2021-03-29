const MetricsDomain = require('.')
const factory = require('../../utils/helpers/factories')

const companyId = 'co_4095e6c0-056d-4b6d-b857-a35584634ad0'
describe('Metrics Domain', () => {
  let statusFactory = null
  let customerFactory = null
  let userFactory = null
  let products = null

  beforeAll(async () => {
    statusFactory = await factory.create('status', {
      type: 'inputs'
    })

    customerFactory = await factory.create('customer')

    userFactory = await factory.create('user')

    const productsFactory = await factory.createMany('product', 3)

    products = productsFactory.map(({ id: productId }) => ({
      productId,
      quantity: 10
    }))
  })

  it('should return metrics to home basic', async () => {
    const response = await MetricsDomain.getMetrics({ companyId })
    console.log(response)
    expect(1).toBe(1)
  })

})
