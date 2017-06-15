var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var main = require('./routes/main');
var usersRoute = require('./routes/users');
var adminRoute = require('./routes/admin');
var router = express.Router();
var parser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({
    extended: false
});
var port = 80;
app.use('/', urlEncodedParser, express.static(path.join(__dirname, 'public')));
app.use('/db/users', urlEncodedParser, usersRoute);
app.use('/admin',urlEncodedParser,adminRoute);
app.listen(port, function () {
    console.log('App listening on port ' + port + '.');
});