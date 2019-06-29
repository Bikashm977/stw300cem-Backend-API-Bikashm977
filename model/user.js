const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    image: {
        type: String
    },
    usertype: {
        type: String
    },
    password: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.statics.checkCrediantialsDb = async (user, pass) => {

    const user1 = await User.findOne({ email: user, password: pass })
    return user1;
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    console.log(token);
    user.tokens = user.tokens.concat({ token: token })
    await user.save()
    return token
}

const User = mongoose.model('User', UserSchema)
module.exports = User