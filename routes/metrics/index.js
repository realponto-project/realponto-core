const router = require('express').Router()
const MetricsController = require('../../controllers/metrics')

router.get('/summary-home-basic', MetricsController.getSummaryToChart)

module.exports = router
