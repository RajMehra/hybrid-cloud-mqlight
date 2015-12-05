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

var mySQLDB = require("../config/mySQLDB");
var pool;


//  var path = require(“path”);

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {

  addVote:addVote
};

/*
  Functions in controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

function addVote(vote, callback){
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
 
  console.log("[INF]", "Adding vote recived data: ");
  console.log(util.inspect(vote));
  
  if (!vote.referenceNumber) {
	  
	  vote.referenceNumber = "Key-" + new Date().getTime();
  }

  if (!vote.votetimeStamp) {
	  
	  vote.votetimeStamp = new Date().toISOString();
  }
  
  
  console.log("[INF]", "Adding vote: ");
  console.log(util.inspect(vote));
  mySQLDB.getVoteByReferenceNumber(vote.referenceNumber, function(err, body){
	  if (err){

          console.log('[vote.insert while checking for record existence] ', err.message);
          callback(err);	 		  
	  }
	  else {
		//      console.log("[INF] Query Error", err.message);	  
		      console.log("[INF] Query Return", body);
		 	    if(!err && body.length != 0){

		
				  var msg = "Vote with  refernece " + vote.referenceNumber + "\" already exists.";
				      console.log("[ERR]", msg);
				      callback(err, msg);
				    }
		 	    else{
				      mySQLDB.addVote(vote, function(err, body){
				        if (err) {
				          console.log('[vote.insert] ', err.message);
				          callback(err);	
				        }
				        else {
					        console.log("[INF]", 'Vote added.')

					        console.log(vote);
						    callback(err, vote);
				        }
				      });      
				 };
	   } 	    
	  })

};

