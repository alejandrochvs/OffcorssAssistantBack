// Router initialize

var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mime = require('mime');

// XLSX initialize

var xlsx = require('xlsx');

// DB initialize

var mongoose = require('mongoose');
var mongoURL = process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://alejandrochvs:Sanrafael1@localhost:27017/assistant?authSource=admin';
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    // Sizes section

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

    // Users section

    // Crypto set

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

    var users = require('./user_model.js');
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
                res.send(err);
            } else if (err && err.code === 11000) {
                res.send('User already exists.');
            } else {
                res.send('Success');
            }

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

    // e-cards section

    var eCards = require('./e-cards_model.js');
    router.post('/e-cards', function (req, res) {
        eCards.find().count({}, function (err, count) {
            var data = {
                count: count
            };
            eCards.find().limit(Number(req.body.perPage)).skip(Number(req.body.offset)).exec(function (err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    data.docs = docs;
                    res.send(data);
                }
            });
        });

    });
    router.post('/e-cards/match', function (req, res) {
        eCards.find({
            gender: req.body.gender,
            age: req.body.age,
            occasion: {
                $in: req.body.occasion
            },
            weather: {
                $in: req.body.weather
            }

        }).exec(function (err, found) {
            if (err) {
                res.send(err);
            } else {
                res.send(found);
            }
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
                res.send(err);
            } else {
                res.send('success.');
            }
        })
    });
    router.post('/e-cards/delete', function (req, res) {
        var toDelete = req.body.id;
        var fileToDelete = path.join('./public/IMG/ecards/' + toDelete);
        eCards.findOneAndRemove({
            _id: toDelete
        }, function (err) {
            if (err) {
                res.send(err);
            }
            fs.unlink(fileToDelete, function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('Deleted');
                }
            });
        });
    });
    router.post('/e-cards/deleteAll', function (req, res) {
        eCards.remove({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Las e-cards se han borrado.');
            }
        })
    })
    router.post('/e-cards/getReferences', function (req, res) {
        eCards.findById(req.body.id, function (err, doc) {
            if (err) {
                res.send(err);
            } else {
                res.send(doc);
            }
        });
    });
    router.post('/e-cards/load', function (req, res) {
        var workbook = xlsx.readFile('./e-cards.xlsx');
        var json = []
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var subChaptCell, subChaptVal;
        var first = 0;
        var last = 115;
        var cols = [{
            url: 'H',
            ref: 'K'
        }, {
            url: 'J',
            ref: 'K'
        }, {
            url: 'M',
            ref: 'N'
        }, {
            url: 'P',
            ref: 'Q'
        }];
        var counter = 0;
        for (var i = first; i < (last - 2); i++) {
            if (worksheet[cols[0].url + (i + 3)] != undefined) {
                json.push({});
                var j = 0;
                json[json.length - 1].url = [];
                while ((j < cols.length) && (worksheet[cols[j].url + (i + 3)] != undefined)) {
                    json[json.length - 1].url[j] = {};
                    // URL
                    subChaptCell = worksheet[cols[j].url + (i + 3)];
                    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
                    json[json.length - 1].url[j].path = subChaptVal + '.jpg';

                    // References

                    subChaptCell = worksheet[cols[j].ref + (i + 3)];
                    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
                    if (subChaptCell != undefined) {
                        if (isNaN(subChaptVal)) {
                            json[json.length - 1].url[j].reference = subChaptVal.split(',')
                        } else {
                            json[json.length - 1].url[j].reference = [subChaptVal];
                        }
                    }

                    j++;
                }
                // Gender

                subChaptCell = worksheet['B' + (i + 3)];
                subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
                json[json.length - 1].gender = subChaptVal;

                // Age

                subChaptCell = worksheet['A' + (i + 3)];
                subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
                if (subChaptVal == 'NINA' || subChaptVal == 'NINO') {
                    subChaptVal = 'NIÑA-NIÑO';
                }
                json[json.length - 1].age = subChaptVal;

                // Occasions

                subChaptCell = worksheet['D' + (i + 3)];
                subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
                if (subChaptCell != undefined) {
                    json[json.length - 1].occasion = subChaptVal.split(', ');
                }

                // Weather

                subChaptCell = worksheet['E' + (i + 3)];
                subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
                if (subChaptCell != undefined) {
                    if (subChaptVal.split(', ') == 'NO MOSTRAR CLIMA') {
                        json[json.length - 1].weather = ["FRÍO", "TEMPLADO", "CALIENTE"];
                    } else {
                        json[json.length - 1].weather = subChaptVal.split(', ');
                    }
                }
            }
        }

        // Save JSON
        fs.writeFile(path.join(__dirname, '../e_cards.json'), JSON.stringify(json), 'utf-8', function (err) {
            if (err) {
                res.send(err);
            } else {
                var e_cardsToDb = [];
                for (var i = 0; i < json.length; i++) {
                    var e_card = new eCards({
                        "url": json[i].url,
                        "gender": json[i].gender,
                        "age": json[i].age,
                        "occasion": json[i].occasion,
                        "weather": json[i].weather,
                    });
                    e_cardsToDb.push(e_card);
                }
                eCards.collection.insert(e_cardsToDb, function (insErr, docs) {
                    if (insErr) {
                        res.send(insErr);
                    } else {
                        res.send(docs);
                    }
                })

            }
        });
    });

    // Ages section

    var ages = require('./ages_model.js');
    router.post('/ages', function (req, res) {
        ages.find({}, function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            }
        })
    });

    // Colors section

    var colors = require('./colors_model.js');
    router.post('/colors/toggle', function (req, res) {
        var request = req.body;
        if (request.status == 'true') {
            request.status = true;
        } else {
            request.status = false;
        }
        colors.findOne({
            hex: request.hex
        }, function (err, color) {
            if (err) {
                res.send(err);
            } else {
                color.active = request.status;
                color.save(function (err, colorSaved) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(colorSaved);
                    }
                })
            }
        });
    })
    router.post('/colors', function (req, res) {
        var query = {};
        if (req.body.query == 'false') {} else {
            query.active = true;
        }
        colors.find(query, null, {
            sort: {
                color: 1
            }
        }, function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            }
        })
    });

    // Genders section

    var genders = require('./genders_model.js');
    router.post('/genders', function (req, res) {
        genders.find({}, function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            }
        })
    });

    // Occasions section

    var occasions = require('./occasions_model.js');
    var occasionsArr = require('./occasionsArr_model.js');
    router.post('/occasions', function (req, res) {
        occasions.findOne({}, function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                occasionsArr.findOne({}, function (err, doc) {
                    if (err) {
                        res.send(err);
                    } else {
                        var tempAns = docs[req.body.gender];
                        tempAns = tempAns[req.body.age];
                        var tempArrAns = [];
                        for (var i = 0; i < tempAns.length; i++) {
                            tempArrAns.push(doc.arr[tempAns[i]]);
                        }
                        res.send(tempArrAns);
                    }
                })
            }
        })
    });
    router.post('/occasionsArr', function (req, res) {
        occasionsArr.findOne({}, function (err, doc) {
            if (err) {
                res.send(err);
            } else {
                res.send(doc.arr);
            }
        })
    });
    router.post('/occassionsInd', function (req, res) {
        occasions.findOne({}, function (err, doc) {
            if (err) {
                res.send(err);
            } else {
                res.send(doc);
            }
        })
    });
    router.post('/occasionToggle', function (req, res) {
        occasions.findOne({}, function (err, doc) {
            if (err) {
                res.send(err);
            } {
                if (req.body.gender == 'boy') {
                    if (req.body.age == 'newborn') {
                        if (doc.boy.newborn.indexOf(req.body.toggle) < 0) {
                            doc.boy.newborn.push(req.body.toggle);
                        } else {
                            doc.boy.newborn.splice(doc.boy.newborn.indexOf(req.body.toggle), 1);
                        }
                    } else if (req.body.age == 'baby') {
                        if (doc.boy.baby.indexOf(req.body.toggle) < 0) {
                            doc.boy.baby.push(req.body.toggle);
                        } else {
                            doc.boy.baby.splice(doc.boy.baby.indexOf(req.body.toggle), 1);
                        }
                    } else {
                        if (doc.boy.boy.indexOf(req.body.toggle) < 0) {
                            doc.boy.boy.push(req.body.toggle);
                        } else {
                            doc.boy.boy.splice(doc.boy.boy.indexOf(req.body.toggle), 1);
                        }
                    }
                } else {
                    if (req.body.age == 'newborn') {
                        if (doc.girl.newborn.indexOf(req.body.toggle) < 0) {
                            doc.girl.newborn.push(req.body.toggle);
                        } else {
                            doc.girl.newborn.splice(doc.girl.newborn.indexOf(req.body.toggle), 1);
                        }
                    } else if (req.body.age == 'baby') {
                        if (doc.girl.baby.indexOf(req.body.toggle) < 0) {
                            doc.girl.baby.push(req.body.toggle);
                        } else {
                            doc.girl.baby.splice(doc.girl.baby.indexOf(req.body.toggle), 1);
                        }
                    } else {
                        if (doc.girl.boy.indexOf(req.body.toggle) < 0) {
                            doc.girl.boy.push(req.body.toggle);
                        } else {
                            doc.girl.boy.splice(doc.girl.boy.indexOf(req.body.toggle), 1);
                        }
                    }
                }
                doc.save(function(err,saved){
                    if (err){
                        res.send(err);
                    }else{
                        res.send(saved);
                    }
                })
            }
        })
    });

    // Weathers section

    var weathers = require('./weathers_model.js');
    router.post('/weathers', function (req, res) {
        weathers.find({}, function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            }
        })
    });

    // Customers section

    var customers = require('./customers_model.js');
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
                res.send(err);
            } else if (err && err.code === 11000) {
                res.send('User already exists.');
            } else {
                res.sendStatus('OK');
            }
        });
    });
    router.post('/customers', function (req, res) {
        var sort = req.body.sort;
        var query;
        if (req.body.query) {
            query = {};
            query[req.body.sort] = new RegExp(req.body.query, "i");
        }
        customers.find(query).count({}).exec(function (err, count) {
            if (err) {
                res.send(err);
            } else {
                var data = {
                    count: count
                };
                customers.find(query).sort([[sort, -1]]).limit(25).skip(Number(req.body.offset)).exec(function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        data.docs = docs;
                        res.send(data);
                    }
                });
            }
        });

    });
    router.post('/deleteCustomers', function (req, res) {
        customers.remove({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Removed customers');
            }
        })
    });
    router.get('/getCustomersExcel', function (req, res) {
        customers.find({}, function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                var wb = {
                    SheetNames: [],
                    Sheets: {}
                };
                var ws_name = "Clientes";
                var ws_data = [
                    ["Fecha - Hora", "E-card", "Nombre", "Género", "Edad", "Tallas (Superior , Inferior , Calzado)", "Teléfono", 'Personalidad', 'Color', 'Clima', 'Ocasión']
                ];
                for (var i = 0; i < docs.length; i++) {
                    var cDoc = docs[i];
                    ws_data.push([cDoc.date, cDoc.e_card, cDoc.name, cDoc.gender, cDoc.age, cDoc.size_top + ' , ' + cDoc.size_bottom + ' , ' + cDoc.size_shoe, cDoc.phone, cDoc.personality.join(','), cDoc.color.join(','), cDoc.weather.join(','), cDoc.occasion.join(',')]);
                }
                var ws = xlsx.utils.aoa_to_sheet(ws_data);
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
                xlsx.writeFile(wb, 'customers.xlsx');
                var file = path.join(__dirname, '../customers.xlsx');
                var filename = path.basename(file);
                var mimetype = mime.lookup(file);
                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype);
                var filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        })
    })
});

module.exports = router;
