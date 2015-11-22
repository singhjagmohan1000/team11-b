
var mq_client = require('../rpc/client');
var ejs= require('ejs');

function signup(req,res){
	
	ejs.renderFile('./views/signupCustomer.ejs',function(err,result)
	{
		if(!err) 
		{
			res.end(result);
	    }
	    // render or error
	    else 
	    {
	    	res.render('error');
	    	console.log(err);
	    }
	});

}

function login(req,res){
	
	ejs.renderFile('./views/loginCustomer.ejs',function(err,result)
			{
				if(!err) 
				{
					res.end(result);
			    }
			    // render or error
			    else 
			    {
			    	res.render('error');
			    	console.log(err);
			    }
			});

}
function loginCustomer(req,res){
	var customer_id = req.param('customer_id');
    var password = req.param('password');
    var msg_payload = {
        	"customer_id":customer_id,	
            "password" : password,
            "type": "loginCustomer"
        };
mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("Login results" + results);
            
            console.log(results.message);
            	res.send(results);
            
            
        }
    });
    

}
function signupCustomer(req,res){
	var customer_id= req.param('customer_id');
	var email = req.param('email');
    var password = req.param('password');
    var firstName = req.param('first_name');
    var lastName = req.param('last_name');
    var address = req.param('address');
    var city = req.param('city');
    var state = req.param('state');
    var zipCode = req.param('zipCode');
    var phoneNumber = req.param('mobile');
    var cc_number = req.param('cc_number');
    var cc_name = req.param('cc_name');
    var cvv = req.param('cvv');
    var month = req.param('month');
    var year = req.param('year');

    

    var msg_payload = {
    	"customer_id":customer_id,
        "email" : email,	
        "password" : password,
        "firstName" : firstName,
        "lastName" : lastName,
        "address" : address,
        "city" : city,
        "state" : state,
        "zipCode" : zipCode,
        "phoneNumber" : phoneNumber,
        "cc_number" : cc_number,
        "cc_name" : cc_name,
        "cvv" : cvv,
        "month" : month,
        "year" : year,
        "type": "signupCustomer"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            
            	res.render('loginCustomer');
            
            
        }
    });
}
exports.login=login;
exports.loginCustomer=loginCustomer;
exports.signupCustomer=signupCustomer;
exports.signup=signup;