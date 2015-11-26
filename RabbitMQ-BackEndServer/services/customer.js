var mysql=require('./mysql');
var mongo=require('./mongo/createCustomer');
var Customer = mongo.Customer;



function handleRequest(msg,callback){
	switch(msg.type)
	{
		case "signupCustomer":
			signupCustomer(msg,callback);
			break;
		case "loginCustomer":
			loginCustomer(msg,callback);
			break;
		case "customer_deleteself":
			customer_deleteself(msg,callback);
			break;
	}
	
}     



function signupCustomer(msg, callback){

	var customer_id = msg.customer_id;
	var email = msg.email;
    var password = msg.password;
    var firstname = msg.firstName;
    var lastname = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipcode = msg.zipCode;
    var phonenumber = msg.phoneNumber;
    var cc_number = msg.cc_number;
    var cc_name = msg.cc_name;
    var cvv = msg.cvv;
    var month = msg.month;
    var year = msg.year;
    var c_activated = "N";
    var c_available = "Y";
    var c_deleted = "N";
    
    
    var response;
    
    var sqlQuery = "INSERT INTO customer_info (customer_id, c_first_name, c_last_name, c_address, c_city, " +
    				"c_state, c_zipcode, c_phonenumber, c_email, " +
    				"c_password, c_cc_number, c_cc_name, c_cc_mm, c_cc_yyyy, c_cc_cvv, c_activated, c_available, c_deleted) VALUES (" + 
    				"'" + customer_id + "'," +
    				"'" + firstname + "'," +
    				"'" + lastname + "'," +
    				"'" + address+ "'," +
    				"'" + city + "'," +
    				"'" + state + "'," +
    				"'" + zipcode + "'," +
    				"'" + phonenumber + "'," +
    				"'" + email + "'," +
    				"'" + password + "'," +
    				"'" + cc_number + "'," +
    				"'" + cc_name + "'," +
    				"'" + month + "'," +
    				"'" + year + "'," +
    				"'" + cvv + "'," +
    				"'" + c_activated + "'," +
    				"'" + c_available + "'," +    				
    				"'" + c_deleted + "')";
    
    
    mysql.fetchData(function(err,result){
    
    	if(err){ 
    		
    		response =({status:500,message: "Customer! Registeration failed" });
    		callback(null,response);
    		
    	}
    	else{
    		
    		//console.log("IN FETCHDATA TO CHECK DUPLICATE IN ELSE");
    		if(result.length > 0){
    			
    			response =({status:300, message: "Customer with this ID already exists" });
    			console.log("IN FETCHDATA TO CHECK DUPLICATE RECORD EXISTS");
    			callback(null,response);			
    		}
    		else{
    			
    			//console.log("IN FETCHDATA NO DUPLICATE RECORD");
    			
    			mysql.fetchData(function(err,result){
    				
    				//console.log("IN SECOND FETCHDATA TO INSERTING CUSTOMER");
    				if (err) {
    					
    	                response =({status:500,message: "Customer! Registeration failed" });
    	                //console.log("IN FETCHDATA TO INSERTION FAILED");
    	                callback(null,response);
    	            }
    	            else {var createMongoCustomer = new Customer({
    	    			customer_id: customer_id,
    	    			c_email: email,
    	    			c_first_name: firstname,
    	    			c_last_name: lastname
    	            });

    	    		createMongoCustomer.save(function(err) {

    	                if (err) {
    	                   throw err;

    	                }
    	                else {
    	                   response = ({status:200, message: "Customer! Registeration Succesful" });
    	                   callback(null, response);
    	                }
    	                
    	                
    	             });
    	            }     	
    			},sqlQuery);
    		}
    	}
    	}, "select * from customer_info where customer_id = '" + customer_id + "'");
    
}


function loginCustomer(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	var sqlQuery = "select * from customer_info where c_email = '" + email +  "' and c_password='" + password +"' and c_deleted != 'Y'";
	
	 mysql.fetchData(function(err,result){
		 
			if(err){ 
				response =({status:500, message: "Customer! Login failed" });
				callback(null,response);
			}
			else{
				
				console.log("IN ELSE OF CUSTOMER LOGIN : " + JSON.stringify(result));
				
				if(result.length > 0){
					
					//console.log("CUSTOMER DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));
					//console.log("flag for activation : " + result[0].c_activated);
					
					if(result[0].c_activated == "Y"){
						
						response =({status:200, message: "Customer! Login Successful", customer_id: result[0].customer_id });
						
					}
					else{
						
						response =({status:400, message: "Customer Not Activated"});												
					}
					callback(null,response);
					
				}
				
				else{
					
					response = ({status:500, message: "Customer! Login failed" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}



function customer_deleteself(msg,callback){
	
	var customer_id = msg.customer_id;
	
	var response;
	
	var sqlQuery = "update customer_info set c_deleted = 'Y' where customer_id = '" + customer_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not delete customer");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("customer deleted : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	






exports.handleRequest=handleRequest;

