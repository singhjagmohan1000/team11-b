//super simple rpc server example
//Testing backend server

var amqp = require('amqp')
, util = require('util');

var login = require('./services/login')

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){
				console.log("Listening login_queue"+message);
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
//cnn.on('ready', function(){
//	console.log("listening on fetch_queue");
//
//	cnn.queue('fetch_queue', function(q){
//		q.subscribe(function(message, headers, deliveryInfo, m){
//			util.log(util.format( deliveryInfo.routingKey, message));
//			util.log("Message: "+JSON.stringify(message));
//			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
//			login.fetch_data(message, function(err,res){
//
//				//return index sent
//				cnn.publish(m.replyTo, res, {
//					contentType:'application/json',
//					contentEncoding:'utf-8',
//					correlationId:m.correlationId
//				});
//			});
//		});
//	});
//});
//cnn.on('ready', function(){
//	console.log("listening on signup_queue");
//
//	cnn.queue('signup_queue', function(q){
//		q.subscribe(function(message, headers, deliveryInfo, m){
//			util.log(util.format( deliveryInfo.routingKey, message));
//			util.log("Message: "+JSON.stringify(message));
//			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
//			login.signup(message, function(err,res){
//
//				//return index sent
//				cnn.publish(m.replyTo, res, {
//					contentType:'application/json',
//					contentEncoding:'utf-8',
//					correlationId:m.correlationId
//				});
//			});
//		});
//	});
//});