const StatusDomain = require('./index')

describe('create new status', () => {
  it('create status', async () => {
    console.log(await StatusDomain.create({}))
    await StatusDomain.create({})
  })
})
