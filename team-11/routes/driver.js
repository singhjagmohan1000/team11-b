
var mq_client = require('../rpc/client');
var ejs = require('ejs');


function signup(req,res){
	
	if(req.session.driver_id){
		
		res.render("driverhome");
	}
	else{
		
		res.render("signupDriver");
	}
}


function login(req,res){
	
	if(req.session.driver_id){
		
		res.render("driverhome");
	}
	else{
		
		res.render("loginDriver");
	}
}


function loginDriver(req,res){
	var fieldState = {email: 'VALID', password: 'VALID'};
	var email = req.param('email');
    var password = req.param('password');
    
    var msg_payload = {"email": email, "password" : password, "type": "loginDriver"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err){
            console.log(err);
            res.send(err);
        } 
        else {
        	
            if(results.status == 200){
            	
            	console.log("IN IF OF DRIVER LOGIN");
            	req.session.driver_id = results.driver_id;
            	res.status(200).send("success");
            	//res.render("driverhome");
            }            
            else{
            	
            	console.log("IN ELSE OF DRIVER LOGIN");
            	
            	res.status(404).send({loginDrive:results.message});           	         	
            }
        }
    });
}


function signupDriver(req,res){
	
	var driver_id= req.param('driver_id');
	var email = req.param('d_email');
    var password = req.param('d_password');
    var firstName = req.param('d_first_name');
    var lastName = req.param('d_last_name');
    var address = req.param('d_address');
    var city = req.param('d_city');
    var state = req.param('d_state');
    var zipCode = req.param('d_zipcode');
    var phoneNumber = req.param('d_phonenumber');
    var d_car_number = req.param('d_car_number');
    var d_car_name = req.param('d_car_name');
    var response;
    
    var driver_id_validate = /^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/;
    var car_number_validate = /^[0-9][a-z]{3}[0-9]{3}$/;
    var email_validate = /\S+@\S+\.\S+/;
    var zipCode_validate = new RegExp("^\\d{5}(-\\d{4})?$");
    
    
    if(!driver_id_validate.test(driver_id)){
    	
    	console.log("in IF. invalid SSN");
    	res.end("invalid driver_id");
    	return;
    }
    
    if(!car_number_validate.test(d_car_number)){
    	
    	console.log("In IF invalid registration number");
    	res.end("In IF invalid registration number");
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
    
    
    
    var msg_payload = {
    		
    	"driver_id":driver_id,
        "email" : email,	
        "password" : password,
        "firstName" : firstName,
        "lastName" : lastName,
        "address" : address,
        "city" : city,
        "state" : state,
        "zipCode" : zipCode,
        "phoneNumber" : phoneNumber,
        "d_car_number" : d_car_number,
        "d_car_name" : d_car_name,
        "type":"signupDriver"      
    };

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
    	
        
        if (err) {
        	
            console.log(err);           
        } 
        else{
        	
        	if(results.status == 200){
        	
        		console.log("in ELSE of driver signup about results" + JSON.stringify(results));
        		console.log("successful login");
        		res.render('loginDriver');
        	}
        	else{
        		
        		res.end(results.message);
        	}
            
        }
    });
}


exports.getdriverdetails = function(req,res){
	
	
	var msg_payload = {"driver_id": req.session.driver_id, "type": "getdriverdetails"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("Driver details" + JSON.stringify(results));            
            res.end(JSON.stringify(results));
        }
    });
}


exports.driver_deleteself = function(req,res){
	
	
	var msg_payload = {"driver_id": req.session.driver_id, "type": "driver_deleteself"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("Driver deleted" + JSON.stringify(results));  
            req.session.destroy();
            res.end();
        }
    });
}






exports.login = login;
exports.loginDriver = loginDriver;
exports.signupDriver = signupDriver;
exports.signup = signup;