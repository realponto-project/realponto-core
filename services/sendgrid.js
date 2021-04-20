const sgMail = require('@sendgrid/mail')
const { pathOr, isEmpty, applySpec, always, path } = require('ramda')
const yup = require('yup')

class SendgridService {
  async sendMail(payload) {
    const to = pathOr({}, ['to'], payload)

    if (process.env.NODE_ENV === 'test') return

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    if (isEmpty(to)) throw new Error('to cannot be null')

    const payloadSchema = yup.object().shape({
      subject: yup.string().required(),
      templateId: yup.string().required()
    })

    await payloadSchema.validate(payload, { abortEarly: false })

    const buildMsg = applySpec({
      from: always('noreply@alxa.com.br'),
      subject: path(['subject']),
      templateId: path(['templateId']),
      personalizations: ({ to }) => [{ to: [to], dynamicTemplateData: to }]
    })

    // DADOS RECUPERAR SENHA

    //   from: 'noreply@alxa.com.br',
    //   subject: 'Recuperar senha',
    //   templateId: 'd-e4638d1b007549efa883162ae5568f21',
    //   personalizations: [
    //     {
    //       to: [to],
    //       dynamicTemplateData: to
    //     }
    //   ]

    return await sgMail.send(buildMsg(payload))
  }
}

module.exports = new SendgridService()
