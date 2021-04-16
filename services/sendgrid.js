const sgMail = require('@sendgrid/mail')
const { pathOr, isEmpty } = require('ramda')

class SendgridService {
  async sendMail(payload) {
    const to = pathOr({}, ['to'], payload)

    if (process.env.NODE_ENV === 'test') return

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    if (isEmpty(to)) throw new Error('to cannot be null')

    const msg = {
      from: 'jessi_leandro@hotmail.com',
      subject: 'Boas vindas',
      templateId: 'd-eb83e3f33e544391ba534890727eab26',
      personalizations: [
        {
          to: [to],
          dynamicTemplateData: to
        }
      ]
    }

    return await sgMail.send(msg)
  }
}

module.exports = new SendgridService()
