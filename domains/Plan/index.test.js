const PlanDomain = require('./index')
const { fakerPlan } = require('../../utils/helpers/fakers')
const factory = require('../../utils/helpers/factories')

describe('plan doamain', () => {
  describe('create new plan', () => {
    it('create new plan', async () => {
      expect.hasAssertions()

      const fakerPlanCreated = fakerPlan()
      const planCreated = await PlanDomain.create(fakerPlanCreated)

      expect(planCreated).toHaveProperty('id', planCreated.id)
      expect(planCreated).toHaveProperty(
        'activated',
        fakerPlanCreated.activated
      )
      expect(planCreated).toHaveProperty(
        'description',
        fakerPlanCreated.description
      )
      expect(planCreated).toHaveProperty('discount', fakerPlanCreated.discount)
      expect(planCreated).toHaveProperty(
        'quantityProduct',
        fakerPlanCreated.quantityProduct
      )
      expect(planCreated).toHaveProperty('amount', fakerPlanCreated.amount)
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
    it('getAll plan', async () => {
      expect.hasAssertions()

      const getAllPlan = await PlanDomain.getAll({})

      expect(getAllPlan).toHaveProperty('rows')
      expect(getAllPlan).toHaveProperty('count')
    })
  })
})
