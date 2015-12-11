'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 http://www.w3schools.com/js/js_strict.asp
*/

var mqlight = require('mqlight');
/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var uuid = require('node-uuid');

var PUBLISH_TOPIC = process.env.TOPIC || "redbook/vote";
var PUBLISH_HOST = process.env.MQHOST || "<Cloud Host for MQ Server>";
var PUBLISH_PORT = process.env.MQPORT || 5672;
var PUBLISH_USER = process.env.MQUSER || "<User Id to connect to MQ Server>";
var PUBLISH_PASSWORD = process.env.MQPASSWORD || "<Password to connect MQ server>";
var PUBLISH_SERVICE = process.env.MQSERVICE || "amqp://localhost";
var PUBLISH_USE = process.env.MQUSESERVER || "CLOUD";
var PUBLISH_ID = process.env.MQID ||  "send_" + uuid.v4().substring(0, 7);

// valid values process.env.MQUSESERVER   'CLOUD', 'BLUEMIX', LOCAL' ;


 // MQ  Credentials 
var opts = {};
var mqlightService = {};
var services = {};


if (process.env.VCAP_SERVICES) {

  services = JSON.parse(process.env.VCAP_SERVICES);
	
  console.log( 'Running BlueMix');
  if (PUBLISH_USE == "LOCAL") {
	  console.log("Cannot use LOCAL service defaulting to Bluemix");
	  PUBLISH_USE = "BLUEMIX";	
  }
  
//}
	if (!services.mqlight) {
	//   No MQ Light on Bluemix use CLOUD Service
	    console.log( 'Error - Check that app is bound to MQ Light service ', services);
	    console.log('Defaulting to Cloud Service');
	    PUBLISH_USE = 'CLOUD';	
	}
}	
if (PUBLISH_USE == 'BLUEMIX')	 {
	var mqlightService = services.mqlight[0];
	console.log("MQlight Service parameter", services.mqlight);
  
	console.log("MQlight Service", mqlightService);
	opts.service = mqlightService.credentials.connectionLookupURI;
	opts.user = mqlightService.credentials.username;
	opts.password = mqlightService.credentials.password;
	opts.id = PUBLISH_ID;

} 


if (PUBLISH_USE == 'LOCAL') {
	opts.service = 'amqp://localhost';
	opts.id = PUBLISH_ID;
}


if (PUBLISH_USE == 'CLOUD') {
	opts.service = 'amqp://' + PUBLISH_USER + ':' + PUBLISH_PASSWORD + '@' + PUBLISH_HOST + ':' + PUBLISH_PORT ;
	opts.id = PUBLISH_ID;
}

var options = { qos: mqlight.QOS_AT_LEAST_ONCE ,
				ttl : 60* 60 * 1000
				};


console.log("[INF] MQ Connection Options for: " + PUBLISH_USE + " ="  + util.inspect(opts));


function sendMessage(message, callback){		
		console.log("[INF] MQ getting connection for: " + PUBLISH_USE + " ="  + util.inspect(opts));
	
		var client = mqlight.createClient(opts);
						
			//once connection is acquired, send messages
		client.on('started', function() {
			console.log('Connected to %s using client-id %s', client.service, client.id);
			console.log('Sending to: %s', PUBLISH_TOPIC);
						
			// send message 

			client.send(PUBLISH_TOPIC, message, options,function(err,response){
	        	
		        
			    client.stop();
//		        console.log("[INF]", "MQ Client stopped" + util.inspect(client));	  
	            if(!err) {
			        console.log("[INF]", "Response \n" + util.inspect(response));	
	                callback(err, response);
	            }   
	            else{
	            	callback(err);
	            }
	        });			
			

			
		});
			
/*		client.on('error', function(error) {
			console.error('*** error ***');
			if (error) {
			 if (error.message) console.error('message: %s', error.toString());
			 else if (error.stack) console.error(error.stack);
			}
			console.error('Exiting.');
			throw(error);
		});
*/		
		
};

module.exports = {
		   sendMessage: sendMessage
		};
