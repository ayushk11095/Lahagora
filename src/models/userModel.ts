const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    mob: {
        type: String,
        trim: true,
        required: true,
    },
    countryCode: {
        type: String,
        trim: true,
        required: true,
    },
    isnCode: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
})

const User = mongoose.model("users", UserSchema)

module.exports = User