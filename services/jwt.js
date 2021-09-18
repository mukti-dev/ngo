const jwt = require('jsonwebtoken')
const appConfig = require('../config/appConfig.json')
const secret = appConfig.JWT_SECRCET

const generateJwtToken = (data) => {
    console.log(data)
    return jwt.sign({
        data: data
    }, secret, { expiresIn: '24h' });
}

module.exports = { generateJwtToken }


