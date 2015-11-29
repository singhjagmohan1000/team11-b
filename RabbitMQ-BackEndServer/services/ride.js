/*
 * CHANGE HISTORY LOG:
 */

/* 
 * Version:     Initial
 * Developer:   Prajwal Kondawar 
 * Date:        23-Nov-2015
 * Description: 1. New API - "createRide()".
 * 				   The API inserts new record (ride) in RIDE_HISTORY table.
 * 				   Then It updates availability flag in customer_info table
 * 				   Then It updates availability flag in driver_info table
 * 
 * 				2. New API - "endRide()".
 * 				   The API inserts new record (ride) in BILLING_INFORMATION table and Updates some attributes in RIDE_HISTORY table.
 * 				   Then It updates availability flag in customer_info table
 * 				   Then It updates availability flag in driver_info table
 */

var mysql=require('./mysql');
//var mongo=require('./mongo/createDriver');
//var Driver = mongo.Driver;

// Initial - Start


// This API is hit when customer clicks on "Start Ride" button

function createRide(msg, callback){

	//var ride_id = msg.ride_id;
    var pickup_location_lat = msg.pickup_location_lat;	
    var pickup_location_long = msg.pickup_location_long;
    var drop_location_lat = msg.drop_location_lat;
    var drop_location_long = msg.drop_location_long;
    var pick_up_date = msg.pick_up_date;
    var temp_drop_off_date = msg.temp_drop_off_date;
    var customer_id = msg.customer_id;
    var driver_id = msg.driver_id;
    var ride_duration = msg.ride_duration;
    var ride_distance = msg.ride_distance;
    var driver_first_name = msg.driver_first_name;
    var driver_last_name = msg.driver_last_name;
    var source_city = msg.source_city;
    var destination_city = msg.destination_city;
        
    var ride_speed;
    var c_cc_number;
    var c_first_name;
    var c_last_name;
    
    var response;
   
    // Manipulating Distance
    
    ride_distance = parseFloat(ride_distance);
    ride_distance = Math.round(ride_distance * 100) / 100; // Rounding to nearest 2 decimal number
    ride_distance = ride_distance.toString();
    
    // Manipulating Time Duration
    ride_duration = parseFloat(ride_duration);
    ride_duration = ride_duration / 60;      // Converting Duration in Hour
    ride_duration = Math.round(ride_duration * 100) / 100; // Rounding to nearest 2 decimal number
    ride_duration = ride_duration.toString();
    
    // Manipulating Speed
    
    ride_speed = parseFloat(ride_distance) / parseFloat(ride_duration);
    ride_speed = Math.round(ride_speed * 100) / 100;
    ride_speed = ride_speed.toString();
    
    
    // Fetching First Name, Last Name, Credit Card Number of a customer to insert in RIDE_HISTORY table
    var sqlQuery= "SELECT c_first_name, c_last_name, c_cc_number FROM customer_info WHERE customer_id = '" + customer_id + "'";
	  
    console.log("From createRide API - c_cc_number Select query: " + sqlQuery);
	
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Selection of first name, last name, c_cc_number failed" });
			callback(null,response);
			
		}
		else{
			
			console.log("Selection of first name, last name, c_cc_number suceeded");
			c_first_name = result[0].c_first_name;
			c_last_name = result[0].c_last_name;
			c_cc_number = result[0].c_cc_number;
			
			// Creating an entry in RIDE_HISTORY table
		    var sqlQuery="INSERT INTO ride_history  " +
		    			  "(pickup_location_lat," +
		    			  "pickup_location_long, " +
		    			  "drop_location_lat, " +
		    			  "drop_location_long, " +
		    			  "pick_up_date, " +
		    			  "temp_drop_off_date, " +
		    			  "customer_id, " +
		    			  "driver_id, " +
		    			  "ride_duration, " +
		    			  "ride_distance, " +
		    			  "ride_speed, " + 
		    			  "driver_first_name, " +
		    			  "driver_last_name, " +
		    			  "c_cc_number, " +
		    			  "source_city, " +
		    			  "destination_city, " +
		    			  "customer_first_name, " +
		    			  "customer_last_name)" +
		    			  "VALUES " +
		    			  	"('" + pickup_location_lat + "'," +
							"'" + pickup_location_long + "'," +
							"'" + drop_location_lat+ "'," +
							"'" + drop_location_long + "'," + 
							"STR_TO_DATE('" + pick_up_date + "', '%Y-%m-%d %T')," +
							"STR_TO_DATE('" + temp_drop_off_date + "', '%Y-%m-%d %T')," +
							"'" + customer_id + "'," +
							"'" + driver_id + "'," +
							"'" + ride_duration + "'," +
							"'" + ride_distance + "'," +
							"'" + ride_speed + "'," +
							"'" + driver_first_name + "'," +
							"'" + driver_last_name + "'," +
							"'" + c_cc_number + "'," +
							"'" + source_city + "'," +
							"'" + destination_city + "'," +
							"'" + c_first_name + "'," +
							"'" + c_last_name + "')";
		    
		    console.log("From createRide API - RIDE_HISTORY Insert query: " + sqlQuery);
			
		    mysql.fetchData(function(err,result){
				if(err){
					
					response =({status:500,message: "Insertion in RIDE_HISTORY failed" });
					callback(null,response);
					
				}
				else{
							
					console.log("Insertion in RIDE_HISTORY succeeded");
					
					// Now updating availability flag in customer_info table
					
					sqlQuery= "UPDATE customer_info SET c_available = 'N' WHERE customer_id = '" +  customer_id + "'";
					console.log("From createRide API - Update Customer Availability query: " + sqlQuery);
					
					mysql.fetchData(function(err,result){
						if(err){
							
							response =({status:500,message: "Updation of customer's availability flag failed" });
							callback(null,response);
							
						}
						else{
									
							console.log("Updation of customer's availability flag succeeded");
							
							// Now updating availability flag in driver_info table
							
							sqlQuery= "UPDATE driver_info SET d_available = 'N' WHERE driver_id = '" +  driver_id + "'";
							console.log("From createRide API - Update Driver Availability query: " + sqlQuery);
							
							mysql.fetchData(function(err,result){
								if(err){
									
									response =({status:500,message: "Updation of driver's availability flag failed" });
									callback(null,response);
									
								}
								else{
									
									console.log("Updation of driver's availability flag succeeded");
									response =({status:200, message: "Ride Started" });
									callback(null, response);
							        
								}
							},sqlQuery);
					        
						}
						
					},sqlQuery);
						        
				}
				
			},sqlQuery);
		    
		}  
		  
    },sqlQuery);
}



function endRide(msg, callback){

	var bill = {};
	
	//bill = getRideBill(); // This function is remaining...
	
	var total_fare = bill.base_fare + bill.time_fare + bill.distance_fare;
		
	var ride_id = msg.ride_id;
    var customer_id = msg.customer_id;
    var driver_id = msg.driver_id;
    var temp_drop_off_date = msg.temp_drop_off_date;
    
    var response;
   
    /*var sqlQuery = "UPDATE ride_history SET drop_off_date = str_to_date('" + temp_drop_off_date + "', '%Y-%d-%m %T'), " +
    			   " base_fare = '" + bill.base_fare + "'," + "time_fare = '" + bill.time_fare + "'," + 
    			   "distance_fare = '" + bill.distance_fare + "'," + "total_fare = '" + total_fare + "' " + 
    			   "WHERE ride_id = '" + ride_id + "'";*/ 
	
    var sqlQuery = "UPDATE ride_history SET drop_off_date = str_to_date('" + temp_drop_off_date + "', '%Y-%d-%m %T'), " +
	   " base_fare = '" + "10" + "'," + "time_fare = '" + "11" + "'," + 
	   "distance_fare = '" + "13" + "'," + "total_fare = '" + "14" + "' " + 
	   "WHERE ride_id = '" + ride_id + "'";
    
    console.log("From endRide API - RIDE_HISTORY Update query: " + sqlQuery);
    
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Updation in RIDE_HISTORY failed" });
			callback(null,response);
			
		}
		else{
			
			console.log("Updation in RIDE_HISTORY succeeded");
			
			sqlQuery= "UPDATE customer_info SET c_available = 'Y' WHERE customer_id = '" +  customer_id + "'";
			console.log("From endRide API - Update Customer Availability query: " + sqlQuery);
			
			mysql.fetchData(function(err,result){
				if(err){
					
					response =({status:500,message: "Updation of customer's availability flag failed" });
					callback(null,response);
					
				}
				else{
							
					console.log("Updation of customer's availability flag succeeded");
					
					// Now updating availability flag in driver_info table
					
					sqlQuery= "UPDATE driver_info SET d_available = 'Y' WHERE driver_id = '" +  driver_id + "'";
					console.log("From endRide API - Update Driver Availability query: " + sqlQuery);
					
					mysql.fetchData(function(err,result){
						if(err){
							
							response =({status:500,message: "Updation of driver's availability flag failed" });
							callback(null,response);
							
						}
						else{
							
							console.log("Updation of driver's availability flag succeeded");
							response =({status:200, message: "Ride Ended" });
							callback(null, response);
					        
						}
					},sqlQuery);
			        
				}
				
			},sqlQuery);
					
		}
				
	},sqlQuery);
    
}




function deleteRideBill(msg, callback){

	var response;
	var ride_id = msg.ride_id;
	   
    var sqlQuery = "DELETE FROM ride_history WHERE ride_id = '" + ride_id + "'"; 
	
    console.log("From deleteRideBill API - RIDE_HISTORY delete query: " + sqlQuery);
    
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Deletion of RIDE failed" });
			callback(null,response);
			
		}
		else{
			
			console.log("Deletion of RIDE Suceeded");
			response =({status:200, message: "Ride/Bill Deleted" });
			callback(null, response);
			
		}
		
	},sqlQuery);
    
}


// This API pulls customer's Ride History with his ID

function customerRideHistory(msg, callback){

	var response;
	var customer_id = msg.customer_id;
	   
    var sqlQuery = "SELECT * FROM ride_history WHERE customer_id = '" + customer_id + "'";   
	
    console.log("From customerRideHistory API - Customer's RIDE_HISTORY Select query: " + sqlQuery);
    
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Selection of Customer's Ride History failed" });
			callback(null,response);
			
		}
		else{
			
			console.log("Selection of Customer's Ride History suceeded");
			response =({status:200, result: result, message: "Customer Ride History" });
			callback(null, response);
			
		}
		
	},sqlQuery);
    
}


//This API pulls driver's Ride History with his ID

function driverRideHistory(msg, callback){

	var response;
	var driver_id = msg.driver_id;
	   
    var sqlQuery = "SELECT * FROM ride_history WHERE driver_id = '" + driver_id + "'";   
	
    console.log("From driverRideHistory API - Driver's RIDE_HISTORY Select query: " + sqlQuery);
    
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Selection of Driver's Ride History failed" });
			callback(null,response);
			
		}
		else{
			
			console.log("Selection of Driver's Ride History suceeded");
			response =({status:200, result: result, message: "Driver Ride History" });
			callback(null, response);
			
		}
		
	},sqlQuery);
    
}



//This API pulls customer's OR driver's Ride History as per Admin's request

function rideHistory(msg, callback){

	var response;
	var historyType = msg.historyType;
	var id = msg.id;
	   
    var sqlQuery = "SELECT * FROM ride_history WHERE " + historyType + " = '" + id + "'";    
	
    console.log("From rideHistory API - Admin's RIDE_HISTORY Select query: " + sqlQuery);
    
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Selection of Ride History for Admin failed" });
			callback(null,response);
			
		}
		else{
			
			console.log("Selection of Ride History for Admin Suceeded");
			response =({status:200, result: result, message: "Admin Ride History" });
			callback(null, response);
			
		}
		
	},sqlQuery);
    
}


// This API searches Bills by attributes - 'Customer', 'Driver', 'City'

function searchBillByAttributes(msg, callback){

	var attributeType = msg.attributeType;
	var attributeValue = msg.attributeValue;
	
	var response;
	var sqlQuery;
	
	if (attributeType === "CUST") { // Search By Customer
		
		sqlQuery = "SELECT * FROM ride_history WHERE customer_id = '" + attributeValue + "'";
		
	} else if (attributeType === "DRIV") { // Search By Driver
		
		sqlQuery = "SELECT * FROM ride_history WHERE driver_id = '" + attributeValue + "'";
		
	} else if (attributeType === "CITY") { // Search By City
		
		sqlQuery = "SELECT * FROM ride_history WHERE source_city = '" + attributeValue + "'";
		
	}
	
	console.log("From searchBillByAttributes API - Select Bill query: " + sqlQuery);
    
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Selection of Bill by Attribute Failed" });
			callback(null,response);
			
		}
		else{
			
			console.log("Selection of Bill by Attribute Suceeded");
			response =({status:200, result: result, message: "Bill By Attribute" });
			callback(null, response);
			
		}
		
	},sqlQuery);
    
}



//This API is hit when driver clicks on "End Ride" button

function getRideBill()
{

 /*
  * This function should implement pricing algorithm and return all the bill elements as an object
  */
	
}


function handleRequest(msg,callback){
	
	switch(msg.type)
	{
		case "createRide":
			console.log("Switch - createRide");
			createRide(msg,callback);
			break;
			
		case "endRide":
			console.log("Switch - endRide");
			endRide(msg,callback);
			break;
		
		case "deleteRideBill":
			console.log("Switch - deleteRideBill");
			deleteRideBill(msg,callback);
			break;
			
		case "customerRideHistory":
			console.log("Switch - customerRideHistory");
			customerRideHistory(msg,callback);
			break;
			
		case "driverRideHistory":
			console.log("Switch - driverRideHistory");
			driverRideHistory(msg,callback);
			break;	
		
		case "rideHistory":
			console.log("Switch - rideHistory");
			rideHistory(msg,callback);
			break;	
			
		case "searchBillByAttributes":
			console.log("Switch - searchBillByAttributes");
			searchBillByAttributes(msg,callback);
			break;
			
				
	}
	return;
}     

//Initial - End

exports.handleRequest=handleRequest;