var express = require('express');
var app = express();
var router = express.Router();
var exec = require('child_process').exec;
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../'));
    },
    filename: function (req, file, callback) {
        callback(null, 'excel.xlsx');
    }
});
var upload = multer({
    storage: storage
}).single('excel');

router.post('/status', function (req, res) {
    var cmd = 'git fetch origin master';
    exec(cmd, function (err, stdout, stderr) {
        var cmd = 'git status';
        exec(cmd, function (err, stdout, stderr) {
            res.send(stdout);
        });
    });
})
router.post('/pull', function (req, res) {
    var cmd = 'git pull';
    exec(cmd, function (err, stdout, stderr) {
        res.send(stdout);
    });
});
router.post('/excel', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send(req.file.originalname);
        }
    });
});
router.post('/loadCards', function (req, res) {
    var cmd = 'node import.js';
    exec(cmd, function (err, stdout, stderr) {
        res.send('Loaded e-cards.');
    });
});
module.exports = router;
