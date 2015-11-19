
var mq_client = require('../rpc/client');


exports.index = function (req,res){
	
	res.render('signupCustomer');

};

exports.login = function(req,res){
	
	res.render('loginCustomer');

};