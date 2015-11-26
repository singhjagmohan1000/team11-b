var mysql = require('./mysql');
var mongo = require('./mongo/createDriver');
var Driver = mongo.Driver;


function handleRequest(msg,callback){
	switch(msg.type)
	{
		case "signupDriver":
			signupDriver(msg,callback);
			break;
		case "loginDriver":
			loginDriver(msg,callback);
			break;
		case "getdriverdetails":
			getdriverdetails(msg,callback);
			break;
		case "driver_deleteself":
			driver_deleteself(msg,callback);
			break;
	}
	//return;
}


function signupDriver(msg, callback){

	console.log("IN SIGN UP DRIVER AT SERVER");
	var driver_id = msg.driver_id;
	var email = msg.email;
    var password = msg.password;
    var firstname = msg.firstName;
    var lastname = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipcode = msg.zipCode;
    var phonenumber = msg.phoneNumber;
    var d_car_number = msg.d_car_number;
    var d_car_name = msg.d_car_name;
    var d_activated = "N";
    var d_available = "Y";
    var d_deleted = "N";
    
    var response;
   
    var sqlQuery = "INSERT INTO driver_info (driver_id, d_first_name, d_last_name, d_address, " +
    				"d_city, d_state, d_zipcode, d_phonenumber, d_email, d_car_name, d_car_number, d_password, " +
    				"d_activated, d_available, d_deleted)  VALUES (" + 
    				"'"	+ driver_id + "'," +
    				"'" + firstname + "'," +
    				"'" + lastname + "'," +
    				"'" + address+ "'," +
    				"'" + city + "'," +
    				"'" + state + "'," +
    				"'" + zipcode + "'," +
    				"'" + phonenumber + "'," +
    				"'" + email + "'," +
    				"'" + d_car_name + "'," +
    				"'" + d_car_number + "'," +
    				"'" + password + "'," +
    				"'" + d_activated + "'," +
    				"'" + d_available + "'," +
    				"'" + d_deleted + "')";
    
    
    mysql.fetchData(function(err,result){
    	
    console.log("IN FETCHDATA TO CHECK DUPLICATE");
	if(err){ 
		
		response =({status:500,message: "Driver! Registeration failed" });
		callback(null,response);
		
	}
	else{
		
		console.log("IN FETCHDATA TO CHECK DUPLICATE IN ELSE");
		if(result.length > 0){
			
			response =({status:300, message: "Driver with this ID already exists" });
			console.log("IN FETCHDATA TO CHECK DUPLICATE RECORD EXISTS");
			callback(null,response);			
		}
		else{
			
			console.log("IN FETCHDATA NO DUPLICATE RECORD");
			
			mysql.fetchData(function(err,result){
				
				console.log("IN SECOND FETCHDATA TO INSERTING DRIVER");
				if (err) {
					
	                response =({status:500,message: "Driver! Registration failed" });
	                console.log("IN FETCHDATA TO INSERTION FAILED");
	                callback(null,response);
	            }
	            else {
	            	
	               response = ({status:200,message: "Driver! Registeration Succesful" });
	               console.log("DRIVER INSERTED TO MYSQL");
	               callback(null, response);
	               
//	               
//	               var createMongoDriver = new Driver({
//	   					driver_id: driver_id,
//	   					d_email: email,
//	   					d_first_name: firstname,
//	   					d_last_name: lastname
//	   				});
//	               	
//	               console.log("GOING IN MONGO SAVE FUNCTION");
//	               
//	   				createMongoDriver.save(function(err) {
//	   				
//	   					console.log("In Mongo save function");
//	   					if (err) {
//	   						console.log("in mongo save function IN IFFFF ERROR");
//	   						response =({status:500,message: "Driver! Registeration failed" });
//	   						callback(null, response);
//	   					}
//	   					else {
//	   						console.log("In Mongo save function IN ELSE SUCCESSFULL INSERTION");
//	   						response = ({status:200,message: "Driver! Registeration Succesful" });
//	   						callback(null, response);
//	   					}
//	   				});
	            }     	
			},sqlQuery);
		}
	}
	}, "select * from driver_info where driver_id = '" + driver_id + "'");
}


function loginDriver(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	var sqlQuery = "select * from driver_info where d_email = '" + email + "' and d_password = '" + password + "' and d_deleted != 'Y'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				response =({status:500, message: "Driver! Login failed" });
				callback(null,response);
			}
			else{
				
				console.log("login driver data from MYSQL " + JSON.stringify(result));
				if(result.length > 0){
					
					console.log("DRIVER DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));
					console.log("flag for activation : " + result[0].d_activated);
					
					if(result[0].d_activated == "Y"){
						
						response =({status:200, message: "Driver! Login Successful", driver_id: result[0].driver_id});						
					}
					else{
						
						response =({status:400, message: "Driver Not Activated"});												
					}
					callback(null,response);
				}
				else{
					
					console.log("in outer else");
					response =({status:500, message: "Driver! Login failed" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}	




function getdriverdetails(msg,callback){
	
	var driver_id = msg.driver_id;
	
	var response;
	
	var sqlQuery = "select * from driver_info where driver_id = '" + driver_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve driver details");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("driver details retrieved : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	



function driver_deleteself(msg,callback){
	
	var driver_id = msg.driver_id;
	
	var response;
	
	var sqlQuery = "update driver_info set d_deleted = 'Y' where driver_id = '" + driver_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not delete driver");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("driver deleted : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	



     

exports.handleRequest=handleRequest;













