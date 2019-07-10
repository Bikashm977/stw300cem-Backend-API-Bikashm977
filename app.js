require('./connection/db');
const user = require('./model/user');
const hostel = require('./model/Hostel');
const room = require('./model/room');
const Message = require('./model/message');
const Review = require('./model/review');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
const path = require('path');
const multer = require('multer');

var Image;
app.use("/images", express.static("images"))
var storage = multer.diskStorage({
    destination: "images",
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        Image = file.fieldname + "_" + Date.now() + ext;
        callback(null, Image);
    }
});

var imageFileFilter = (req, file, cb) => {
    if
        (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { return cb(newError("You can upload only image files!"), false); }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 1000000
    }
});


app.post('/upload', upload.single('imageFile'), (req, res) => {
    console.log(Image)
    res.send(Image)
})

app.post('/uploadimg', upload.single('files'), (req, res) => {
    res.send(JSON.stringify({
        filename: Image
    }))
})

// User Registration
app.post('/register', function (req, res) {
    var fullname = req.body.fullname;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var image = "image";
    var usertype = "buyer";
    var password = req.body.password;
    console.log(req.body);

    var userData = new user({
        fullname: fullname,
        email: email,
        phone: phone,
        address: address,
        image: image,
        usertype: usertype,
        password: password
    })
    user.findOne({
        email: email
    }).then(function (data) {
        if (data) {
            res.send(JSON.stringify('user_registred'));
            res.json({ msg: "user_exist" });
        }
        else {
            userData.save().then(function (data) {
                res.send(JSON.stringify('user_registred'));
                console.log('user already exist.!');
                res.json({ msg: "user_not_exist" })
            })

        }
    }).catch(function (e) {
        res.send(e);
    })

})

//User login Web
app.post("/login22", async function (req, res) {

    const User = await user.checkCrediantialsDb(req.body.email,
        req.body.password)
    const token = await User.generateAuthToken()
    res.send({ token: token, User: User })
    console.log(User);
})

//User login Android
app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(req.body);

    user.find({
        email: email,
        password: password

    }).then(function (logindata) {

        if (logindata) {
            console.log(logindata)
            res.send(JSON.stringify(logindata));
        }
        else {
            res.send(JSON.stringify('invalid_login'))
        }
    }).catch(function (e) {
        res.send(e)
    })
})

//select user
app.get('/users', auth, function (req, res) {
    res.send(req.user);
})

// Profile Update
app.post('/updateuser/:id', function (req, res) {
    var fullname = req.body.fullname;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var image = req.body.image;
    var uid = req.params.id;
    console.log(req.body);
    user.updateOne({ _id: new ObjectID(uid) },
        {
            $set: {
                fullname: fullname,
                email: email,
                phone: phone,
                address: address,
                image: image
            }
        }).then(function () {
            console.log('Success')
            res.send(JSON.stringify('profile_updated'));
        }).catch(function () {
            console.log('error')
        })

})


//user logout
app.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Add hostel
app.post('/addhostel', function (req, res) {
    var hostelname = req.body.hostelname;
    var hosteltype = req.body.hosteltype;
    var email = req.body.email;
    var address = req.body.address;
    var phone = req.body.phone;
    var description = req.body.description;
    var image = req.body.image;

    var HostelData = new hostel({
        hostelname: hostelname,
        hosteltype: hosteltype,
        email: email,
        address: address,
        phone: phone,
        description: description,
        image: image
    })
    hostel.findOne({
        hostelname: hostelname
    }).then(function (data) {
        if (data) {
            res.json({ msg: "hostel_exist" });
        }
        else {
            HostelData.save().then(function (data) {
                res.json({ msg: "hostel_not_exist" })
            })

        }
    }).catch(function (e) {
        res.send(e);
    })

})


//View hostels
app.get('/viewhostel', function (req, res) {
    var mysort = { _id: -1 };
    hostel.find().sort(mysort).then(function (hostel) {
        res.send(hostel);

    }).catch(function (e) {
        res.send(e);
    })
})

//Get Boys Hostel
app.get('/getboys', function (req, res) {
    var mysort = { _id: -1 };
    var query = { hosteltype: "Boys" }
    hostel.find(query).sort(mysort).then(function (hostel) {
        res.send(hostel);
    }).catch(function (e) {
        res.send(e)
    })
})

//Get Girls Hostel
app.get('/getgirls', function (req, res) {
    var mysort = { _id: -1 };
    var query = { hosteltype: "Girls" }
    hostel.find(query).sort(mysort).then(function (hostel) {
        res.send(hostel);
    }).catch(function (e) {
        res.send(e)
    })
})


//Delete hostel
app.delete('/deletehostel/:id', function (req, res) {

    hostel.findByIdAndDelete(req.params.id).then(function () {
        res.send('Hostel_deleted')
    }).catch(function (e) {
        res.send(e)
    })
    room.deleteMany({ hostelId: req.params.id }).then(function () {
        console.log("room deleted")
    }).catch(function (e) {
        res.send(e)
    })
})

//Edit Hostel
app.get('/edithostel/:id', function (req, res) {
    var id = req.params.id;
    hostel.find({ _id: new ObjectID(id) }).then(function (hostel) {
        res.send(hostel)
        res.json({ msg: "hostel_delete" })
    }).catch(function (e) {
        res.send(e)
    })
})

//Update Hostel
app.post('/updatehostel', function (req, res) {
    var hostelname = req.body.hostelname;
    var hosteltype = req.body.hosteltype;
    var email = req.body.email;
    var address = req.body.address;
    var phone = req.body.phone;
    var description = req.body.description;
    var uid = req.body.id;

    console.log(req.body);
    hostel.updateOne({ _id: new ObjectID(uid) },
        {
            $set: {
                hostelname: hostelname,
                hosteltype: hosteltype,
                email: email,
                address: address,
                phone: phone,
                description: description
            }
        }).then(function () {
            console.log('Success')
        }).catch(function () {
            console.log('error')
        })
    room.updateMany({ hostelId: uid },
        {
            $set: {
                hostelname: hostelname
            }
        }).then(function () {
            console.log('Success')
        }).catch(function () {
            console.log('error')
        })

})


// Add Room
app.post('/add_hostel_room', function (req, res) {
    var roomtype = req.body.roomtype;
    var bed = req.body.bed;
    var price = req.body.price;
    var hostelId = req.body.hostelId;
    var hostelname = req.body.hostelname;

    console.log(req.body);

    var RoomData = new room({
        roomtype: roomtype,
        bed: bed,
        price: price,
        hostelId: hostelId,
        hostelname: hostelname
    })
    RoomData.save().then(function () {
        res.json({ msg: "room_saved" })
    }).catch(function (e) {
        res.send(e)
    })

})

//View Room
app.get('/viewrooms', function (req, res) {
    var mysort = { _id: -1 };
    room.find().sort(mysort).then(function (room) {
        res.send(room);
    }).catch(function (e) {
        res.send(e);
    })
})

//Edit room
app.get('/edit_hostel_room/:id', function (req, res) {
    var id = req.params.id;
    room.find({ _id: new ObjectID(id) }).then(function (room) {
        res.send(room)
        res.json({ msg: "room_edited" })
    }).catch(function (e) {
        res.send(e)
    })
})

//Delete Room
app.delete('/delete_hostel_room/:id', function (req, res) {
    room.findByIdAndDelete(req.params.id).then(function () {
        res.json({ msg: "room_delete" })
    }).catch(function (e) {
        res.send(e)
    })
})

//Update Room
app.post('/update_hostel_room', function (req, res) {
    var roomtype = req.body.roomtype;
    var bed = req.body.bed;
    var price = req.body.price;
    var uid = req.body.id;

    console.log(req.body);
    room.updateOne({ _id: new ObjectID(uid) },
        {
            $set: {
                roomtype: roomtype,
                bed: bed,
                price: price
            }
        }).then(function () {
            console.log('Success')
        }).catch(function () {
            console.log('error')
        })

})

//get room
app.get('/get_room/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    room.find({ hostelId: new ObjectID(id) }).then(function (room) {
        res.send(room)
        res.json({ msg: "room_edited" })
    }).catch(function (e) {
        res.send(e)
    })
})


// User Message
app.post('/send_user_message', function (req, res) {
    var fullname = req.body.fullname;
    var email = req.body.email;
    var phone = req.body.phone;
    var hostelname = req.body.hostelname;
    var message = req.body.message;
    console.log(req.body);

    var MessageData = new Message({
        fullname: fullname,
        email: email,
        phone: phone,
        hostelname: hostelname,
        message: message
    })
    MessageData.save().then(function () {
        res.send(JSON.stringify('Message_sent'));
    }).catch(function (e) {
        res.send(e)
    })

})

//View User Messages
app.get('/viewmessage', function (req, res) {
    var mysort = { _id: -1 };
    Message.find().sort(mysort).then(function (Message) {
        res.send(Message);
    }).catch(function (e) {
        res.send(e);
    })
})

//Delete User Message
app.delete('/delete_message/:id', function (req, res) {
    Message.findByIdAndDelete(req.params.id).then(function () {
        console.log(req.param.id);
        res.json({ msg: "message_delete" })
    }).catch(function (e) {
        res.send(e)
    })
})

// User Review
app.post('/user_review', function (req, res) {
    var fullname = req.body.fullname;
    var review = req.body.review;
    var ratting = req.body.ratting;
    var hostelname = req.body.hostelname;
    var hostelId = req.body.hostelId;
    console.log(req.body);

    var ReviewData = new Review({
        fullname: fullname,
        review: review,
        ratting: ratting,
        hostelname: hostelname,
        hostelId: hostelId
    })
    ReviewData.save().then(function () {
        res.send(JSON.stringify('Review_sent'));
    }).catch(function (e) {
        res.send(e)
    })

})

//get user revies
app.get('/get_review/:id', function (req, res) {
    var id = req.params.id;
    Review.find({ hostelId: new ObjectID(id) }).then(function (Review) {
        res.send(Review)
        res.json({ msg: "user_review" })
    }).catch(function (e) {
        res.send(e)
    })
})


app.listen(8080)
