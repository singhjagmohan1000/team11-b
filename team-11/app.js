//TESTING ANKIT
//TESTING Prajwal
//Testing parveen
//TESTING AGAIN TESTING
// Testing Ashish
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var customer = require('./routes/customer');
var http = require('http');
var path = require('path');
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
//var mongo = require("./routes/mongo");
var mongoose = require('mongoose');
var connection = mongoose.connect("mongodb://localhost:27017/uber_db");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
//changes done by jagmohan 
//customer
app.get('/signupCustomer',customer.index);
app.get('/loginCustomer',customer.login);
app.post('/signupCustomer',customer.signup);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
