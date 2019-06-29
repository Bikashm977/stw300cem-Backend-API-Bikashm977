const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    hostelname: {
        type: String
    },
    message: {
        type: String
    }
    
})

const message = mongoose.model('message', MessageSchema)
module.exports = message