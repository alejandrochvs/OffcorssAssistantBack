var fs = require('fs');
var express = require('express');
var app = express();
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
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.set('view engine','ejs');
app.get('/',function(req,res){
	res.render('index.html');
});
app.use('/db/users', urlEncodedParser, usersRoute);
app.use('/admin', urlEncodedParser, adminRoute);
app.listen(port, function () {
    console.log('App listening on port ' + port + '.');
});
