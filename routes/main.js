var express = require('express');
var app = express();
var router = express.Router();
router.use('/', function (req, res) {
    res.render('index');
});
module.exports = router;