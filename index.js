// Server variables
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({
    extended: true
});
var path = require('path');
var fs = require('fs');
var port = process.env.PORT || 3000;
// Router variables
var dbRoute = require('./routes/db');
var adminRoute = require('./routes/admin');
var postRoute = require('./routes/post');
// App
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function (req, res) {
    res.render('index', {
        admin: false,
        status: 200
    });
});
app.use('/db', urlEncodedParser, dbRoute);
app.use('/admin', urlEncodedParser, adminRoute);
app.use('/post', urlEncodedParser, postRoute);
app.get('/', function (req, res) {
    res.render('index', {
        admin: false,
        status: 200
    })
});
app.get('/*', function (req, res) {
    res.render('index', {
        admin: false,
        status: 404
    });
});
app.listen(port, function () {
    console.log('App listening on port ' + port + '.');
});
