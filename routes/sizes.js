var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var mongoURL = process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/assistant';
var sizes = require('./sizes_model.js');
router.post('/', function (req, res) {
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
module.exports = router;
