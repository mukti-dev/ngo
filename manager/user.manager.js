const BadRequestError = require('../_errorHandler/400')
const userModel = require('../models/user.model')
const otpModel = require('../models/otp.model')
const { decryptText, encryptText } = require('../services/encryptDecrypt')
const UnauthorizedError = require('../_errorHandler/401')
const { sendSms } = require('../services/sms')
const moment = require('moment')
const InternalServerError = require('../_errorHandler/500')
const saveUserData = async (reqBody) => {
    const user = new userModel(reqBody)
    try {
        return user.save()
    } catch (error) {
        throw error
    }
}
const loginUserDB = async (reqBody, loginType) => {
    try {
        const user = await userModel.findOne({ $or: [{ email: reqBody.username }, { mobile: reqBody.mobile }] }).exec()
        if (user) {
            if (loginType == "password") {
                let isPwMatch = await decryptText(reqBody.password, user.password)
                if (!isPwMatch) {
                    throw new UnauthorizedError("Wrong credentials")
                } else {
                    return user
                }
            } else if (loginType == "otp") {
                return user
            } else {
                throw new BadRequestError("Login type is not valid")
            }

        } else {
            throw new UnauthorizedError("Invalid User")
        }

    } catch (error) {
        throw error
    }
}
const sendOtp = async (mobile, message) => {
    try {
        let sms = await sendSms(mobile, message)
        return sms
    } catch (error) {

        let err = JSON.parse(JSON.stringify(error))
        err.message = error.message

        throw new BadRequestError(err)
    }
}

const saveUserOtp = async (userdata, otp) => {
    try {
        let currentTime = new Date(moment())
        let expireTime = new Date(moment().add(10, 'm'))
        let userId = userdata._id
        let otpData = {
            userId: userId,
            otp: otp,
            createdTime: currentTime,
            expireTime: expireTime,
        }
        otpData = new otpModel(otpData)
        return otpData.save()
    } catch (error) {
        console.log(error)
        throw error
    }
}
const validateOtpDB = async (reqBody, type) => {
    try {
        let otpData = await otpModel.findOne({ _id: reqBody.id }).exec()
        if (otpData) {
            let currentTime = new Date(moment())
            let expireTime = new Date(otpData.expireTime)
            if (currentTime < expireTime) {
                if (reqBody.otp == otpData.otp) {
                    if (type == "login") {
                        const user = await userModel.findOne({ _id: otpData.userId }).exec()
                        return user
                    } else if (type == 'forgetPassword') {
                        let pw = reqBody.password
                        let password = await encryptText(pw)
                        let doc = await userModel.updateOne({ _id: otpData.userId }, { password: password }, {
                            new: true
                        });
                        console.log('doc', doc)
                        return true

                    } else {
                        throw new BadRequestError("type error")
                    }

                } else {
                    throw new UnauthorizedError("Wrong OTP")
                }
            } else {
                throw new UnauthorizedError("OTP expired")
            }
        }
    } catch (error) {
        console.log(error)
        throw new InternalServerError(error)
    }
}


module.exports = { saveUserData, loginUserDB, sendOtp, saveUserOtp, validateOtpDB }