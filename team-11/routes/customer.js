
var mq_client = require('../rpc/client');

function index(req,res){
	
	res.render('signupCustomer');

};

function login(req,res){
	
	res.render('loginCustomer');

};
function signup(req,res){
	var email = req.param('email');
    var password = req.param('password');
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var address = req.param('address');
    var city = req.param('city');
    var state = req.param('state');
    var zipCode = req.param('zipCode');
    var phoneNumber = req.param('phoneNumber');
    var cc_number = req.param('cc_number');
    var cc_name = req.param('cc_name');
    var cvv = req.param('cvv');
    var month = req.param('month');
    var year = req.param('year');

    var msg_payload = {
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
        "func" : "registerCustomer"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            res.status(results.status).send(results.data);
        }
    });
}
exports.login=login;
exports.index=index;
exports.signup=signup;