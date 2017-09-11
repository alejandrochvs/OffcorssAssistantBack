var express = require('express');
var app = express();
var router = express.Router();
var exec = require('child_process').exec;

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
router.post('/loadCards', function (req, res) {
    var cmd = 'node import.js';
    exec(cmd, function (err, stdout, stderr) {
        res.send('Loaded e-cards.');
    });
});
module.exports = router;
