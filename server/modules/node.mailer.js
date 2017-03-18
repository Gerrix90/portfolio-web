const nodeMailer = require('nodemailer')
const envConfig = require('./../config/env.config')

const GMAIL_SENDER_EMAIL = envConfig.get('GMAIL_SENDER_EMAIL')
const GMAIL_APP_EMAIL = envConfig.get('GMAIL_APP_EMAIL')
const GMAIL_APP_PASSWORD = envConfig.get('GMAIL_APP_PASSWORD')

/**
 * @param {Object} message
 * @param {string} message.from
 * @param {string} message.to
 * @param {string} message.subject
 * @param {string} message.html
 * @returns {Promise}
 */
const send = (message) => new Promise((resolve, reject) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_APP_EMAIL,
      pass: GMAIL_APP_PASSWORD
    }
  }, {
    from: GMAIL_SENDER_EMAIL
  })
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error(`Message not sent: ${error}`)
      reject(error)
    }
    console.error(`Message sent: ${JSON.stringify(info)}`)
    resolve()
  })
})

module.exports.send = send
