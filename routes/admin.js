var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
app.set('view engine','jade');
router.post('/edit', function (req, res) {
    var editable;
    var query = req.body.string;
    var change = req.body.change;
    var found = false;
    fs.readFile('./public/js/variables.js', 'UTF-8', function (err, data) {
        if (err) {
            console.log(err);
        }
        editable = data.split(';');
        editable.pop();
        for (var i = 0; i < editable.length; i++) {
            editable[i] = editable[i].split(' = ');
            if (query == editable[i][0]) {
                found = true;
                editable[i][1] = change;
            }
        }
        for (var i = 0; i < editable.length; i++) {
            editable[i] = editable[i].join(' = ');
        }
        editable = editable.join(';');
        editable = editable + ';'
        fs.writeFile('./public/js/variables.js', editable, function (err) {
            if (err) {
                return err;
            }
            if (found) {
                res.send('String succesfully changed.');
            }
            else {
                res.send('String not found.');
            }
        });
    });
});
router.post('/colors', function (req, res) {
    var editable;
    var query = req.body.string;
    var change = req.body.change;
    var found = false;
    fs.readFile('./public/scss/modules/_variables.scss', 'UTF-8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        editable = data.split(';');
        editable.pop();
        for (var i = 0; i < editable.length; i++) {
            editable[i] = editable[i].split(': ');
            if (query == editable[i][0]) {
                found = true;
                editable[i][1] = change;
            }
        }
        for (var i = 0; i < editable.length; i++) {
            editable[i] = editable[i].join(': ');
        }
        editable = editable.join(';');
        editable = editable + ';'
        fs.writeFile('./public/scss/modules/_variables.scss', editable, function (err) {
            if (err) {
                return err;
            }
            if (found) {
                res.send('Color succesfully changed.');
            }
            else {
                res.send('Color not found.');
            }
        });
    });
});
router.get('/', function (req, res) {
    res.render('index',{admin : false});
});
module.exports = router;