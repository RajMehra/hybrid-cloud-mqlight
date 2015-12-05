'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 http://www.w3schools.com/js/js_strict.asp
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var uuid = require('node-uuid');
var mqlight = require('mqlight');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */

var latestResult = [
                    {
                        "VOTECOUNT": 0,
                        "VOTERCHOICE": "Total Votes so far"
                      }
                    ];

var SUBSCRIBE_TOPIC = process.env.RESULTTOPIC || "redbook/results";
var SUBSCRIBE_HOST = process.env.MQHOST || "<Cloud Host for MQ Server>";
var SUBSCRIBE_PORT = process.env.MQPORT || <Cloud Port for MQ server>;

var SUBSCRIBE_USER = process.env.MQUSER || "<User Id to connect to MQ Server>";


var SUBSCRIBE_PASSWORD = process.env.MQPASSWORD || "<Password to connect MQ server>";
var SUBSCRIBE_SERVICE = process.env.MQSERVICE || "amqp://localhost";
var SUBSCRIBE_USE = process.env.MQUSESERVER || "LOCAL";
var SUBSCRIBE_ID = process.env.MQID ||  "recv_" + uuid.v4().substring(0, 7);


// Results only works with MQ /IIB server integration. 

SUBSCRIBE_ID = "Result" +   SUBSCRIBE_ID ;


// valid values process.env.MQUSESERVER   'CLOUD', 'BLUEMIX', LOCAL' ;

var opts = {};
var mqlightService = {};
var services = {};

opts.service = 'amqp://' + SUBSCRIBE_USER + ':' + SUBSCRIBE_PASSWORD + '@' + SUBSCRIBE_HOST + ':' + SUBSCRIBE_PORT ;
opts.id = SUBSCRIBE_ID;


var options = { qos: mqlight.QOS_AT_LEAST_ONCE ,
		ttl : 24 * 60* 60 * 1000,
		autoConfirm: false
		};

console.log("Connection Opt : " + util.inspect(opts));
console.log("Connection Options : " + util.inspect(options));


var client ;

function connectMQ() {
	client = mqlight.createClient(opts);
	//once started, receive messages for the supplied pattern
	client.on('started', function() {
		console.log('Connected to %s using client-id %s', client.service, client.id);
	
		var delayMs = 0;
		var share = undefined;
		// now subscribe to pattern for messages
		client.subscribe(SUBSCRIBE_TOPIC, share, options, function(err, pattern) {
				if (err) {
					console.error('Problem with subscribe request: %s', err.message);
				}
				if (pattern) {
					if (share) {
						console.log('Subscribed to share: %s, pattern: %s', share, pattern);
					} else {
						console.log('Subscribed to pattern: %s', pattern);
					}
				}
			});
	
		// listen to new message events and process them
		client.on('message', function(data, delivery) {
	
			console.log("Result received and cached :" +  data);
			latestResult = eval(data);
			delivery.message.confirmDelivery();
	 
		})
	
	});
	
	client.on('malformed', function(data, delivery) {
	console.error('*** received malformed message (%d)', (++i));
	console.error(data);
	console.error(delivery);
	});
	//});
	
	client.on('error', function(error) {
	console.error('*** error ***');
	if (error) {
	if (error.message) console.error('message: %s', error.toString());
	else if (error.stack) console.error(error.stack);
	}
	console.error('Exiting.');
	});
};
	connectMQ();
	
module.exports = {
  getResults: getResults
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

function getResults(req, res){
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
//	console.log("Returing as json :" + latestResult);
	  res.json(latestResult);
	  
	  console.log("Client State : " + client.state);
	  
	  client.stop(function (err ) {
		  if (err) {
			  console.log("Error Stopping " + err );
		  }		  
		  connectMQ();
	  });
	  

};
