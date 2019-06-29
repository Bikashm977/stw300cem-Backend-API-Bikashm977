const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    review: {
        type: String
    },
    ratting: {
        type: String
    },
    hostelname: {
        type: String
    },
    hostelId: {
        type: String
    }
    
})

const review = mongoose.model('review', ReviewSchema)
module.exports = review