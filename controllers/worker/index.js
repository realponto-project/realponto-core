const {
  updateAdsOnDBQueue,
  adsQueue,
  notificationQueue,
  instanceQueue
} = require('../../services/queue/queues')

const getWorkerInfo = async (req, res, next) => {
  try {
    const updateAdsOnDB = await updateAdsOnDBQueue.getJobCounts()
    const ads = await adsQueue.getJobCounts()
    const notification = await notificationQueue.getJobCounts()
    const instance = await instanceQueue.getJobCounts()

    res.json({
      updateAdsOnDB,
      ads,
      notification,
      instance
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

module.exports = {
  getWorkerInfo
}
