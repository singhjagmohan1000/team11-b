/**
 * New node file
 */
// super simple rpc server example
var amqp = require('amqp'), util = require('util');

var customer = require('./services/customer');
var driver = require('./services/driver');
var admin = require('./services/admin');
var ride = require('./services/ride');
var billing = require('./services/billing');

var cnn = amqp.createConnection({
	host : '127.0.0.1'
});

var mongoose = require('mongoose');
var connection = mongoose.connect("mongodb://localhost:27017/uber_db");

cnn.on('ready', function(){
	console.log("listening on customer_queue");

	cnn.queue('customer_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			customer.signupCustomer(message, function(err,res){
				console.log("Listening customer_queue"+message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});