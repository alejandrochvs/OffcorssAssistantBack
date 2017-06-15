var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
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
            var indexToSearch = editable[i].indexOf(query);
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
router.post('/', function (req, res) {
    res.send({
        admin: true
    });
});
module.exports = router;