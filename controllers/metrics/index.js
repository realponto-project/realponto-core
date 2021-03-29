const { pathOr } = require('ramda')
const MetricsDomain = require('../../domains/metrics')

const getSummaryToChart = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await MetricsDomain.getMetrics({ companyId })
    res.status(200).json(response)
  } catch (error) {
    res.status(404).json({ error })
  }
}

module.exports = {
  getSummaryToChart
}
