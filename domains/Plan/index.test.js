const PlanDomain = require('./index')
const { fakerPlan } = require('../../utils/helpers/fakers')
const factory = require('../../utils/helpers/factories')

describe('create new plan', () => {
  it('create new plan', async () => {
    expect.hasAssertions()
    const planCreated = await PlanDomain.create(fakerPlan())

    expect(planCreated).toHaveProperty('id')
    expect(planCreated).toHaveProperty('activated')
    expect(planCreated).toHaveProperty('description')
    expect(planCreated).toHaveProperty('discount')
    expect(planCreated).toHaveProperty('quantityProduct')
    expect(planCreated).toHaveProperty('amount')
  })
})

describe('update plan', () => {
  let planFactory = null

  beforeAll(async () => {
    planFactory = await factory.create('plan')
  })

  it('update plan', async () => {
    expect.hasAssertions()
    const planMock = fakerPlan()

    const planUpdated = await PlanDomain.update(planFactory.id, planMock)

    expect(planUpdated).toHaveProperty('id', planFactory.id)
    expect(planUpdated).toHaveProperty('activated', planMock.activated)
    expect(planUpdated).toHaveProperty('description', planMock.description)
    expect(planUpdated).toHaveProperty('discount', planMock.discount)
    expect(planUpdated).toHaveProperty(
      'quantityProduct',
      planMock.quantityProduct
    )
    expect(planUpdated).toHaveProperty('amount', planMock.amount)
  })
})

describe('get plan', () => {
  let planFactory = null

  beforeAll(async () => {
    planFactory = await factory.create('plan')
  })

  it('getById plan', async () => {
    expect.hasAssertions()

    const getPlanById = await PlanDomain.getById(planFactory.id)

    expect(getPlanById).toHaveProperty('id', planFactory.id)
    expect(getPlanById).toHaveProperty('activated', planFactory.activated)
    expect(getPlanById).toHaveProperty('description', planFactory.description)
    expect(getPlanById).toHaveProperty('discount', planFactory.discount)
    expect(getPlanById).toHaveProperty(
      'quantityProduct',
      planFactory.quantityProduct
    )
    expect(getPlanById).toHaveProperty('amount', planFactory.amount)
  })

  it('getAll plan', async () => {
    expect.hasAssertions()

    const getAllPlan = await PlanDomain.getAll({})

    expect(getAllPlan).toHaveProperty('rows')
    expect(getAllPlan).toHaveProperty('count')
  })
})
