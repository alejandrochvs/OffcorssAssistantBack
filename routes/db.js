var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var mongoURL = process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/assistant';
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //Sizes
    var sizes = require('./sizes_model.js');
    router.post('/sizes', function (req, res) {
        var query = req.body.category;
        sizes.findOne({
            name: query
        }, function (err, docs) {
            if (err) {
                res.send(err);
            }
            res.json(docs);
        })
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
                return res.send(err);
            }
            if (err && err.code === 11000) {
                return res.send('User already exists.');
            }
            res.send('Success');
        });
    });
    router.post('/users/login', function (req, res) {
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
                } else {
                    res.send('Wrong password.');
                }
            } else {
                res.send('User not found.');
            }
        });
    });
    //e-cards
    var eCards = require('./e-cards_model.js');
    router.post('/e-cards', function (req, res) {
        eCards.find().count({}, function (err, count) {
            var data = {
                count: count
            };
            eCards.find().limit(Number(req.body.perPage)).skip(Number(req.body.offset)).exec(function (err, docs) {
                if (err) {
                    return console.log(err);
                }
                data.docs = docs;
                res.send(data);
            });
        });

    });
    router.post('/e-cards/match', function (req, res) {
        eCards.find({
            gender: req.body.gender,
            age: req.body.age
        }).exec(function (err, found) {
            if (err) {
                return res.send(err);
            }
            res.send(found);
        })
    });
    router.post('/e-cards/upload', function (req, res) {
        var tempECard = req.body;
        var eCard = new eCards({
            url: tempECard.url,
            gender: tempECard.gender,
            age: tempECard.age,
            reference: [],
            type: [],
            color: [],
            weather: [],
            occasion: []
        });
        if (typeof tempECard.reference == "string") {
            eCard.reference[0] = tempECard.reference;
        } else {
            for (var i = 0; i < tempECard.reference.length; i++) {
                eCard.reference[i] = tempECard.reference[i];
            }
        }
        if (typeof tempECard.type == "string") {
            eCard.type[0] = tempECard.type;
        } else {
            for (var i = 0; i < tempECard.type.length; i++) {
                eCard.type[i] = tempECard.type[i];
            }
        }
        if (typeof tempECard.color == "string") {
            eCard.color[0] = tempECard.color;
        } else {
            for (var i = 0; i < tempECard.color.length; i++) {
                eCard.color[i] = tempECard.color[i];
            }
        }
        if (typeof tempECard.weather == "string") {
            eCard.weather[0] = tempECard.weather;
        } else {
            for (var i = 0; i < tempECard.weather.length; i++) {
                eCard.weather[i] = tempECard.weather[i];
            }
        }
        if (typeof tempECard.occasion == "string") {
            eCard.occasion[0] = tempECard.occasion;
        } else {
            for (var i = 0; i < tempECard.occasion.length; i++) {
                eCard.occasion[i] = tempECard.occasion[i];
            }
        }
        eCard.save(function (err, saved) {
            if (err) {
                return res.send(err);
            }
            res.send('success.')
        })
    });
    router.post('/e-cards/delete', function (req, res) {
        var toDelete = req.body.url;
        var fileToDelete = path.join('./public/IMG/ecards/' + toDelete);
        eCards.findOneAndRemove({
            url: toDelete
        }, function (err) {
            if (err) {
                console.log(res.send(err));
            }
            fs.unlink(fileToDelete, function (err) {
                if (err) {
                    return console.log(err);
                }
                res.send('Deleted');
            });
        });
    });
    router.post('/e-cards/getReferences', function (req, res) {
        eCards.findOne({
            url: req.body.url
        }, function (err, docs) {
            if (err) {
                return console.log(err);
            }
            res.send(docs.reference);
        });
    });
    var ages = require('./ages_model.js');
    router.post('/ages', function (req, res) {
        ages.find({}, function (err, docs) {
            if (err) {
                return res.send(err);
            }
            res.send(docs);
        })
    });
    var colors = require('./colors_model.js');
    router.post('/colors', function (req, res) {
        colors.find({
            active: true
        }, null, {
            sort: {
                color: 1
            }
        }, function (err, docs) {
            if (err) {
                return res.send(err);
            }
            res.send(docs);
        })
    });
    var genders = require('./genders_model.js');
    router.post('/genders', function (req, res) {
        genders.find({}, function (err, docs) {
            if (err) {
                return res.send(err);
            }
            res.send(docs);
        })
    });
    var occasions = require('./occasions_model.js');
    router.post('/occasions', function (req, res) {
        occasions.find({}, function (err, docs) {
            if (err) {
                return res.send(err);
            }
            res.send(docs);
        })
    });
    var types = require('./types_model.js');
    router.post('/types', function (req, res) {
        types.find({}, function (err, docs) {
            if (err) {
                return res.send(err);
            }
            res.send(docs);
        })
    });
    var weathers = require('./weathers_model.js');
    router.post('/weathers', function (req, res) {
        weathers.find({}, function (err, docs) {
            if (err) {
                return res.send(err);
            }
            res.send(docs);
        })
    });
    var customers = require('./customers_model.js');
    router.post('/customers/filter', function (req, res) {
        var query = {};
        query[req.body.name] = new RegExp(req.body.attr, "i");
        customers.find(query).sort(req.body.name).skip(Number(req.body.offset)).exec(function (err, docs) {
            if (err) {
                return console.log(err);
            }
            res.send(docs);
        });
    });
    router.post('/customers/register', function (req, res) {
        var reqCustomer = req.body;
        var customer = {};
        customer.e_card = reqCustomer.e_card;
        customer.name = reqCustomer.name;
        customer.gender = reqCustomer.gender;
        customer.age = reqCustomer.age;
        customer.phone = reqCustomer.phone;
        customer.size_bottom = reqCustomer.bottomSize;
        customer.size_top = reqCustomer.topSize;
        customer.size_shoe = reqCustomer.shoeSize;
        customer.occasion = reqCustomer.occasion;
        customer.weather = reqCustomer.weather;
        customer.color = reqCustomer.color;
        customer.personality = reqCustomer.personality;
        customer.date = new Date();
        var customertoDb = new customers(customer);
        customertoDb.save(function (err, customer) {
            if (err && err.code !== 11000) {
                console.log(err);
                return res.send(err);
            }
            if (err && err.code === 11000) {
                return res.send('User already exists.');
            }
            res.sendStatus('OK');
        });
    });
    router.post('/customers', function (req, res) {
        var sort = req.body.sort;
        customers.find().count({}, function (err, count) {
            var data = {
                count: count
            };
            customers.find().sort(sort).limit(25).skip(Number(req.body.offset)).exec(function (err, docs) {
                if (err) {
                    return console.log(err);
                }
                data.docs = docs;
                res.send(data);
            });
        });

    });
});

module.exports = router;
