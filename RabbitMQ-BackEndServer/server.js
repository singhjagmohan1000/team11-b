
var amqp = require('amqp'), util = require('util');

var customer = require('./services/customer');
var driver = require('./services/driver');


var cnn = amqp.createConnection({
	host : '127.0.0.1'
});



cnn.on('ready', function(){
	console.log("listening on customer_queue");

	cnn.queue('customer_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			customer.handleRequest(message, function(err,res){
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
	console.log("listening on driver_queue");
	cnn.queue('driver_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driver.handleRequest(message, function(err,res){
				console.log("Listening driver_queue"+message);
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