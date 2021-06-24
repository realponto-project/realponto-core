const yup = require('yup')
const admin = require('firebase-admin')

// const serviceAccount = require('../alxa-ml-firebase-adminsdk-tq8bh-f449accdcb.json')
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)

class NotificationService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  async SendNotification(message) {
    console.log(message)
    const messageSchema = yup.object().shape({
      notification: yup
        .object({
          title: yup.string().required(),
          body: yup.string().required()
        })
        .required(),
      token: yup.string().required()
    })

    await messageSchema.validate(message)

    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response)
      })
      .catch((error) => {
        console.log('Error sending message:', error)
      })
  }
}

module.exports = new NotificationService()
