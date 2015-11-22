var mysql=require('./mysql');
var mongo=require('./mongo/createCustomer');
var Customer = mongo.Customer;

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
    var response;
    var sqlQuery="INSERT INTO customer_info  VALUES (" + 
    				"'" + customer_id + "'," +
    				"'" + firstname + "'," +
    				"'" + lastname + "'," +
    				"'" + address+ "'," +
    				"'" + city + "'," +
    				"'" + state + "'," +
    				"'" + zipcode + "'," +
    				"'" + phonenumber + "'," +
    				"'" + email + "'," +
    				"'" + cc_number + "'," +
    				"'" + cc_name + "'," +
    				"'" + month + "'," +
    				"'" + year + "'," +
    				"'" + cvv + "'," +
    				"'" + password+ "')";
    mysql.fetchData(function(err,result){
	if(err)
		{ throw err;
		}
	else{
		var createMongoCustomer = new Customer({
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
function loginCustomer(msg,callback){
	var customer_id = msg.customer_id;
	var password = msg.password;
	var response;
	var sqlQuery="select * from customer_info where customer_id='"+customer_id+"' and c_password='" + password +"'";
	 mysql.fetchData(function(err,result){
			if(err)
				{ response =({status:500, message: "Customer! Login failed" });
				callback(null,response);
				}
			else{
				if(result.length>0)
					{
					response =({status:200, message: "Customer! Login Successful" });
					callback(null,response);
					}
				else{
					response =({status:500, message: "Customer! Login failed" });
					callback(null,response);
				}
				}
		        },sqlQuery);
}
function handleRequest(msg,callback){
	switch(msg.type)
	{
		case "signupCustomer":
			signupCustomer(msg,callback);
			break;
		case "loginCustomer":
			loginCustomer(msg,callback);
			break;
	}
	return;
}     

exports.handleRequest=handleRequest;