//customer
var customerSchema = require('./model/customerSchema');
var requestGen = require('./commons/responseGenerator');

var Customer = customerSchema.Customer; //mysql instance
var Customers = customerSchema.Customers; //mongoDB instance

exports.signupCustomer = function(msg, callback){

	var customer_id = msg.customer_id;
	var email = msg.email;
    var password = msg.password;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipCode = msg.zipCode;
    var phoneNumber = msg.phoneNumber;
    var cc_number = msg.cc_number;
    var cc_name = msg.cc_name;
    var cvv = msg.cvv;
    var month = msg.month;
    var year = msg.year;

    var json_responses;

    //add data in mysql
    Customer.create({
    	customer_id:customer_id,
    	c_first_name: firstName,
        c_last_ame: lastName,
        c_address: address,
        c_city: city,
        c_state: state,
        c_zipcode: zipCode,
        c_phonenumber: phoneNumber,
        c_email: email,
        c_cc_number: cc_number,
        c_cc_name: cc_name,
        c_cc_mm: month,
        c_cc_yyyy: year,
        c_cc_cvv: cvv,
        c_password: password
    }).then(function(){
        //add data in mongodb
        var newCustomer = new Customers({
            firstName: firstName,
            lastName: lastName,
            email: email
        });

        newCustomer.save(function(err) {

            if (err) {
                json_responses = requestGen.responseGenerator(500, {message: " error registering customer" });
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: "customer registration successfull" });

            }
            callback(null, json_responses);
        });
    });

};

