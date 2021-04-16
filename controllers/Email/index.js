const { pathOr } = require('ramda')
const sendgridService = require('../../services/sendgrid')

class SendgridController {
  async sendMail(req, res, next) {
    const to = pathOr({}, ['body', 'to'], req)
    try {
      const data = await sendgridService.sendMail({ to })

      res.status(200).json(data)
    } catch (error) {
      console.error(error)
      res.status(400).json(error)
    }
  }
}

module.exports = new SendgridController()
