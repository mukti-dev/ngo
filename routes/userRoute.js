const express = require('express')
const { createUser, loginUser, validateOtp, validateOtpForChangePw } = require('../controllers/user.controller')
const { checkValidationResult } = require('../validator/expressvalidator')
const { createUserValidate } = require('../validator/user.validator')
const router = express.Router()

router.post('/signup', createUserValidate(), checkValidationResult, createUser)
router.post('/login/:type', loginUser)
router.post('/validateOtp', validateOtp)
router.post('/changePassword', validateOtpForChangePw)

module.exports = router