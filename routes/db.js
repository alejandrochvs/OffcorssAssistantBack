var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var mongoURL = process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/assistant';

//Sizes
var sizes = require('./sizes_model.js');
router.post('/sizes', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    var query = req.body.category;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        sizes.findOne({
            name: query
        }, function (err, docs) {
            if (err) {
                res.send(err);
                db.close();
            }
            res.json(docs);
            db.close();
        })
    });
});

//Users
var users = require('./user_model.js');
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
router.post('/users/register', function (req, res) {
    console.log(req.body);
    console.log(req.query);
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        var query = req.body;
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
router.post('/users/login', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open', function () {
        var query = req.body;
        users.findOne({
            $or: [{
                username: query.username
        }, {
                mail: query.username
        }]
        }, function (err, docs) {
            if (err) {
                res.send(err);
                mongoose.connection.close();
            }
            if (docs != null) {
                if (query.password == decrypt(docs.password) || query.password == docs.password) {
                    var response = {
                        token: docs.password,
                        username: docs.username,
                        access_level: docs.access_level,
                        name: docs.name,
                        status: 503
                    };
                    response.status = 200;
                    res.send(response);
                    mongoose.connection.close();
                } else {
                    res.send('Wrong password.');
                    mongoose.connection.close();
                }
            } else {
                res.send('User not found.');
                mongoose.connection.close();
            }
            mongoose.connection.close();
        });
    });
});

//e-cards
var eCards = require('./e-cards_model.js');
router.post('/e-cards', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open',function(){
        eCards.find().limit(10).skip(Number(req.body.offset)).exec(function(err,docs){
            if (err){
                db.close();
                return console.log(err);
            }
            db.close();
            res.send(docs);
        });
    })
});
router.post('/e-cards/count', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open',function(){
        eCards.find().count({},function(err,count){
            db.close();
            var data = { count : count};
            res.send(data);
        });
    })
});
router.post('/e-cards/match', function (req, res) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURL);
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open',function(){
        console.log(req.body);
        eCards.find({
            gender : req.body.gender,
            age : req.body.age
        }).exec(function(err,found){
            if (err){
                db.close();
                return res.send(err);
            }
            if (found.length > 1){
                eCards.find({})
            }
            db.close();
            res.send(found);
        })
    })
});
module.exports = router;
