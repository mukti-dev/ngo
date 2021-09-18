const { saveUserData, loginUserDB, sendOtp, saveUserOtp, validateOtpDB } = require('../manager/user.manager')
const { generateJwtToken } = require('../services/jwt')
const { successResponse, failureResponse } = require('../_helper/generateResponse')

const randomstring = require("randomstring");

const loginUser = async (req, res) => {
    let type = req.params.type
    if (type == "otp") {
        try {
            let user = await loginUserDB(req.body, type)
            let mobile = '+91' + user.mobile
            let userData = JSON.parse(JSON.stringify(user))
            delete userData.password
            delete userData.__v
            let otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            let message = `OTP to login to your account is ${otp}`

            mobile = '+91' + '9802275549'

            let sms = await sendOtp(mobile, message)
            if (sms) {
                let otpData = await saveUserOtp(userData, otp)
                let optResp = JSON.parse(JSON.stringify(otpData))
                delete optResp.otp
                delete optResp.__v
                const respData = successResponse(optResp, 'Otp Sent. It is valid upto 10 minuits')
                res.status(200).send(respData)
            }
        } catch (error) {
            // console.log(error)
            failureResponse(req, res, error)
        }


    } else if (type == 'password') {
        try {
            let user = await loginUserDB(req.body, type)
            let userData = JSON.parse(JSON.stringify(user))
            delete userData.password
            delete userData.__v
            let authToken = await generateJwtToken(userData)
            userData.authToken = authToken
            const respData = successResponse(userData, 'User Logged in Successfully')
            res.status(200).send(respData)
        } catch (error) {
            failureResponse(req, res, error)
        }
    }
}

const createUser = async (req, res) => {
    try {
        let reqBody = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            userType: req.body.userType,
        }
        let saveUser = await saveUserData(reqBody)
        let responseData = JSON.parse(JSON.stringify(saveUser))
        delete responseData.password
        delete responseData.userId
        delete responseData.__v

        const respData = successResponse(responseData, 'User Saved Successfully')
        res.status(200).send(respData)
    } catch (error) {
        throw error
    }
}

const validateOtp = async (req, res) => {
    try {
        let user = await validateOtpDB(req.body, 'login')
        let userData = JSON.parse(JSON.stringify(user))
        delete userData.password
        delete userData.__v
        let authToken = await generateJwtToken(userData)
        userData.authToken = authToken
        const respData = successResponse(userData, 'User Logged in Successfully')
        res.status(200).send(respData)

    } catch (error) {
        failureResponse(req, res, error)
    }

}
const validateOtpForChangePw = async (req, res) => {
    try {
        let user = await validateOtpDB(req.body, 'forgetPassword')
        const respData = successResponse(user, 'Password Updated Successfully')
        res.status(200).send(respData)

    } catch (error) {
        console.log(error)
        failureResponse(req, res, error)
    }

}

module.exports = { loginUser, createUser, validateOtp, validateOtpForChangePw }