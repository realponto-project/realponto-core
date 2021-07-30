const router = require('express').Router()
const WorkerController = require('../../controllers/worker')

router.get('/worker', WorkerController.getWorkerInfo)

module.exports = router
