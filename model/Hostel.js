const mongoose = require('mongoose');

const Hostel = mongoose.model('Hostel', {
    hostelname: {
        type: String
    },
    hosteltype: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    }

})
module.exports = Hostel