const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomtype: {
        type: String
    },
    bed: {
        type: String
    },
    price: {
        type: String
    },
    hostelId: {
        type: String
    },
    hostelname: {
        type: String
    }
    
})

const room = mongoose.model('room', RoomSchema)
module.exports = room