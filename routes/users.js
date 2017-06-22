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
var mongoURL = process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/assistant';
var users = require('./user_model.js');
router.use('/register', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
//        var user = mongoose.model('user', userSchema);
        var query = req.query;
        var user = new users(query);
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        if (ip == '::1') {
            ip = '127.0.0.1';
        }
        user.last_ip = ip;
        user.password = encrypt(user.password);
        user.save(function (err, user) {
            if (err && err.code !== 11000) {
                mongoose.connection.close();
                return res.send(err);
            }
            if (err && err.code === 11000) {
                mongoose.connection.close();
                return res.send('User already exists.');
            }
            res.send(user.greet());
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
                        username: docs.username,
                        access_level : docs.access_level,
                        status : 503
                    };
                    response.status = 200;
                    res.send(response);
                    mongoose.connection.close();
                } else {
                    mongoose.connection.close();
                }
            } else {
                mongoose.connection.close();
            }
            mongoose.connection.close();
        });
    })
});
module.exports = router;
