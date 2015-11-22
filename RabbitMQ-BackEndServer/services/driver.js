var mysql=require('./mysql');
var mongo=require('./mongo/createDriver');
var Driver = mongo.Driver;

function signupDriver(msg, callback){

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
    
    var response;
   
    var sqlQuery="INSERT INTO driver_info  VALUES (" + 
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
	"'" + password+ "')";
    mysql.fetchData(function(err,result){
	if(err)
		{ response =({status:500,message: "Driver! Registeration failed" });
		callback(null,response);
		}
	else{
		var createMongoDriver = new Driver({
			driver_id: driver_id,
			d_email: email,
			d_first_name: firstname,
			d_last_name: lastname
        });

		createMongoDriver.save(function(err) {

            if (err) {
                response =({status:500,message: "Driver! Registeration failed" });
            }
            else {
               response = ({status:200,message: "Driver! Registeration Succesful" });
               callback(null, response);
            }
            
            
         });
		}
		},sqlQuery);
	}
function loginDriver(msg,callback){
	var driver_id = msg.driver_id;
	var password = msg.password;
	var response;
	var sqlQuery="select * from driver_info where driver_id='"+driver_id+"' and d_password='" + password +"'";
	 mysql.fetchData(function(err,result){
			if(err)
				{ response =({status:500, message: "Driver! Login failed" });
				callback(null,response);
				}
			else{
				if(result.length>0)
					{
					response =({status:200, message: "Driver! Login Successful" });
					callback(null,response);
					}
				else{
					response =({status:500, message: "Driver! Login failed" });
					callback(null,response);
				}
				}
		        },sqlQuery);
}	
function handleRequest(msg,callback){
	switch(msg.type)
	{
		case "signupDriver":
			signupDriver(msg,callback);
			break;
		case "loginDriver":
			loginDriver(msg,callback);
			break;
	}
	return;
}     

exports.handleRequest=handleRequest;