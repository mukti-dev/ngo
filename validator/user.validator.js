const { body, validationResult } = require('express-validator')
const user = require('../models/user.model')

const loginValidate = () => {
    return [
        body('username').exists().withMessage("Username required").isString().withMessage("Username should be a string"),
        body('password').exists().withMessage("Password required"),
    ]
}

const createUserValidate = () => {
    return [
        body('firstName').exists().withMessage("First name required").isString().withMessage("First name should be a string"),
        body('lastName').exists().withMessage("Last name required").isString().withMessage("Last Name should be a string"),
        body('email').exists().withMessage("Email required").isEmail().withMessage("Please provide a valid email id").custom(value => {
            return new Promise((resolve, reject) => {
                user.findOne({ email: value }, (error, doc) => {
                    if (error) {
                        reject(error)
                    } else {
                        if (doc) {
                            reject("Email Id already exist")
                        } else {
                            resolve(true)
                        }
                    }
                })
            })

        }),
        body('mobile').exists().withMessage("Mobile No required").isMobilePhone().withMessage("Please enter a valid phone number").isLength({ min: 10, max: 10 }).withMessage("Mobile No should be 10 digit").custom(value => {
            return new Promise((resolve, reject) => {
                user.findOne({ mobile: value }, (error, doc) => {
                    if (error) {
                        reject(error)
                    } else {
                        if (doc) {
                            reject("Mobile No already exist")
                        } else {
                            resolve(true)
                        }
                    }
                })
            })

        }),
        body('password').exists().withMessage("Password required").isLength({ min: 6 }).withMessage("Minimum length of password should be 6"),
        body('confirmPassword').exists().withMessage("Please confirm the password").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true
        }),
        body('userType').exists().withMessage("User Type required").isString().withMessage("User type should be a string")
    ]
}

module.exports = { loginValidate, createUserValidate }