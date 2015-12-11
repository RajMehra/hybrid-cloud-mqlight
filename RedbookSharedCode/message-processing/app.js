/* @(#) MQMBID sn=p800-B005-L150603
 su=_SPoV0wnDEeWVCfaY6E0tVA
 pn=appmsging/nodejs/mqlight/samples/recv.js
 */
/*
 * <copyright
 * notice="lm-source-program"
 * pids="5725-P60"
 * years="2013,2014"
 * crc="3568777996" >
 * Licensed Materials - Property of IBM
 *
 * 5725-P60
 *
 * (C) Copyright IBM Corp. 2013, 2014
 *
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 * </copyright>
 */
/* jslint node: true */
/* jshint -W083,-W097 */
'use strict';
var http = require('http');
var mqlight = require('mqlight');
var express = require('express');
var bodyParser = require('body-parser');
//var nopt = require('nopt');
var uuid = require('node-uuid');
var fs = require('fs');
var util = require('util');

var votes = require("./helpers/votes");

// parse the commandline arguments

// connect client to server

/*
 * Establish HTTP credentials, then configure Express
 */
var httpOpts = {};
httpOpts.port = (process.env.VCAP_APP_PORT || 3000);

var lastMessage = {};

var app = express();


var SUBSCRIBE_TOPIC = process.env.TOPIC || "redbook/vote";
var SUBSCRIBE_HOST = process.env.MQHOST || "<Cloud Host for MQ Server>";
var SUBSCRIBE_PORT = process.env.MQPORT || 5672;

var SUBSCRIBE_USER = process.env.MQUSER || "<User Id to connect to MQ Server>";

var SUBSCRIBE_PASSWORD = process.env.MQPASSWORD || "<Password to connect MQ server>";
var SUBSCRIBE_SERVICE = process.env.MQSERVICE || "amqp://localhost";
var SUBSCRIBE_USE = process.env.MQUSESERVER || "CLOUD";
var SUBSCRIBE_ID = process.env.MQID ||  "recv_" + uuid.v4().substring(0, 7);

// valid values process.env.MQUSESERVER   'CLOUD', 'BLUEMIX', LOCAL' ;


var restartMax = 3

var restarts = 0;

/*
 * Add static HTTP content handling
 */
function staticContentHandler(req,res) {
  var url = req.url.substr(1);
  if (url == '') { url = __dirname + '/index.html';};
  if (url == 'style.css') {res.contentType('text/css');}
  fs.readFile(url,
  function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200);
    return res.end(data);
  });
}
app.all('/', staticContentHandler);
app.all('/*.html', staticContentHandler);
app.all('/*.css', staticContentHandler);
app.all('/images/*', staticContentHandler);


/*
 * GET handler to poll for notifications
 */
app.get('/lastMessage', function(req,res) {
  // Do we have a message held?
  var msg = lastMessage;
  if (msg) {
    // Let the next message stream down from MQ Light
    // Send the data to the caller
    res.json(msg);
  }
  else {
    // Just return no-data
    res.writeHead(204);
    res.end();
  }
});

/*
 * Start our REST server
 */
if (httpOpts.host) {
  http.createServer(app).listen(httpOpts.host, httpOpts.port, function () {
    console.log('App listening on ' + httpOpts.host + ':' + httpOpts.port);
  });
}
else {
  http.createServer(app).listen(httpOpts.port, function () {
    console.log('App listening on *:' + httpOpts.port);
  });
}



 // MQ  Credentials 
var opts = {};
var mqlightService = {};
var services = {};


if (process.env.VCAP_SERVICES) {

  services = JSON.parse(process.env.VCAP_SERVICES);
	
  console.log( 'Running BlueMix');
  if (SUBSCRIBE_USE == "LOCAL") {
	  console.log("Cannot use LOCAL service defaulting to Bluemix");
	  SUBSCRIBE_USE = "BLUEMIX";	
  }
  
//}
	if (!services.mqlight) {
	//   No MQ Light on Bluemix use CLOUD Service
	    console.log( 'Error - Check that app is bound to MQ Light service ', services);
	    console.log('Defaulting to Cloud Service');
	    SUBSCRIBE_USE = 'CLOUD';	
	}
}	
if (SUBSCRIBE_USE == 'BLUEMIX')	 {
	var mqlightService = services.mqlight[0];
	console.log("MQlight Service parameter", services.mqlight);
  
	console.log("MQlight Service", mqlightService);
	opts.service = mqlightService.credentials.connectionLookupURI;
	opts.user = mqlightService.credentials.username;
	opts.password = mqlightService.credentials.password;
	opts.id = SUBSCRIBE_ID;

} 


if (SUBSCRIBE_USE == 'LOCAL') {
	opts.service = 'amqp://localhost';
	opts.id = SUBSCRIBE_ID;
}


if (SUBSCRIBE_USE == 'CLOUD') {
	opts.service = 'amqp://' + SUBSCRIBE_USER + ':' + SUBSCRIBE_PASSWORD + '@' + SUBSCRIBE_HOST + ':' + SUBSCRIBE_PORT ;
	opts.id = SUBSCRIBE_ID;
}

var options = { qos: mqlight.QOS_AT_LEAST_ONCE ,
				ttl : 24 * 60 * 60 * 1000,
				autoConfirm: false
				};

console.log("Connection Opt : " + util.inspect(opts));
console.log("Connection Options : " + util.inspect(options));


var client = mqlight.createClient(opts);

// once started, receive messages for the supplied pattern
client.on('started', function() {
  console.log('Connected to %s using client-id %s', client.service, client.id);

  var delayMs = 0;
  var share = undefined;
  // now subscribe to pattern for messages
  client.subscribe(SUBSCRIBE_TOPIC, share, options, function(err, pattern) {
    if (err) {
      console.error('Problem with subscribe request: %s', err.message);
      process.exit(1);
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
   
      console.log(data);
      delivery.message.confirmDelivery();
      votes.addVote(data, function(err, body){
    	  if (err) {
    		  console.log("error adding record to database" + err)
    	  }
    	  else {
    		  console.log("Record saved to database : " + util.inspect(body));
    		  lastMessage = data;
    		  
    	  }
    	  
      })
      
    });
  client.on('malformed', function(data, delivery) {
    console.error('*** received malformed message (%d)', (++i));
    console.error(data);
    console.error(delivery);
  });
});

client.on('error', function(error) {
  console.error('*** error ***');
  if (error) {
    if (error.message) console.error('message: %s', error.toString());
    else if (error.stack) console.error(error.stack);
  }
  console.error('Exiting.');
  process.exit(1);
});


