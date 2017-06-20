var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var main = require('./routes/main');
var usersRoute = require('./routes/users');
var adminRoute = require('./routes/admin');
var router = express.Router();
var parser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({
    extended: false
});
var port = process.env.PORT || 80;
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname ,'/public')));
app.get('/',function(req,res){
	res.render('index',{admin : false});
});
app.use('/db/users', urlEncodedParser, usersRoute);
app.use('/admin', urlEncodedParser, adminRoute);
app.listen(port, function () {
    console.log('App listening on port ' + port + '.');
});
