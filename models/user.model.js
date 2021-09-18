const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { encryptText } = require('../services/encryptDecrypt')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },

})
userSchema.pre("save", async function (next) {
    const userData = this

    if (this.isModified("password") || this.isNew) {
        let pw = await encryptText(userData.password)
        userData.password = pw
        next()

    } else {
        return next()
    }
})

const user = mongoose.model('Users', userSchema)
module.exports = user