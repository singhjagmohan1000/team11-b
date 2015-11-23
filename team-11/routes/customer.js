
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
	
	ejs.renderFile('./views/loginCustomer.ejs',function(err,result){
		if(!err){
			res.end(result);
	    }
		else{
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
        } 
        else {
            console.log("Login results" + results);
            
            console.log(results.message);
           	res.send(results);
        }
    });
}


function signupCustomer(req,res){
	
	var customer_id = req.param('customer_id');
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

    var customer_id_validate = /^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/;
    var email_validate = /\S+@\S+\.\S+/;
    var zipCode_validate = new RegExp("^\\d{5}(-\\d{4})?$");
    
    
    if(!customer_id_validate.test(customer_id)){
    	
    	console.log("in IF. invalid SSN");
    	res.end("invalid customer_id");
    	return;
    }
    
    
    if(!email_validate.test(email)){
    	
    	console.log("In IF invalid EMAIL");
    	res.end("In IF invalid EMAIL");
    	return;    	
    }
    
    
    if(!zipCode_validate.test(zipCode)){
    	
    	console.log("In IF invalid ZIPCODE");
    	res.end("In IF invalid ZIPCODE");
    	return;    	
    }
        
    if(phoneNumber.toString().length != 10){
    	
    	console.log("In IF invalid PHONE");
    	res.end("In IF invalid PHONE");
    	return;     	
    }
    
    if(cc_number.toString().length > 15 && cc_number.toString().length < 20){
    	
    	console.log("In IF invalid Card Number");
    	res.end("In IF invalid card number");
    	return;     	
    }
    
        
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