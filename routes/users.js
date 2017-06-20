var express = require('express');
var app = express();
var router = express.Router();
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '2ba8f2b30e434b431e46e008d8f0';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/assistant';
var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    access_level: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    last_connection: {
        type: Date,
        required: true
    },
    last_ip: {
        type: String,
        required: true
    },
    current_page: {
        type: String,
        required: true
    }
});
userSchema.methods.greet = function () {
    var greeting = this.name ? "Hello!, my name is " + this.name : "I don't have a name :( ";
    return greeting;
}
var users = mongoose.model('users', userSchema);
router.use('/register', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        var user = mongoose.model('user', userSchema);
        var query = req.query;
        var testUser = new user(query);
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        if (ip == '::1') {
            ip = '127.0.0.1';
        }
        testUser.last_ip = ip;
        testUser.password = encrypt(testUser.password);
        testUser.save(function (err, user) {
            if (err && err.code !== 11000) {
                mongoose.connection.close();
                return res.send(err);
            }
            if (err && err.code === 11000) {
                mongoose.connection.close();
                return res.send('User already exists.');
            }
            res.send(testUser.greet());
            mongoose.connection.close();
        });
    });
});
router.use('/login', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        var query = req.query;
        users.findOne({
            username: query.username
        }, function (err, docs) {
            if (err) throw err;
            if (docs != null) {
                if (query.password == decrypt(docs.password) || query.password == docs.password) {
                    var response = {
                        token: docs.password,
                        username: encrypt(docs.username)
                    };
                    res.send(response);
                }else{
                    res.send('Incorrect password.');
                }
            } else {
                res.send('User not found.');
            }
            mongoose.connection.close();
        })
    })
});
module.exports = router;
