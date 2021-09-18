const appConfig = require('../config/appConfig.json')

const twilioCongig = appConfig.twilioCongig
const accountSid = twilioCongig.ACCOUNT_SID
const authToken = twilioCongig.AUTH_TOKEN
const twilioPhoneNo = twilioCongig.PHONE
const client = require('twilio')(accountSid, authToken);

const sendSms = (phone, message) => new Promise((resolve, reject) => {
    client.messages.create({
        body: message,
        from: twilioPhoneNo,
        to: phone
    }).then(message => resolve(message)).catch(error => {

        reject(error)
        // throw error
    })
})


module.exports = { sendSms }