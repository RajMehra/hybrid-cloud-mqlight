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

var mySQLDB = require("../helpers/mySQLDB");
var pool;

mySQLDB.pool(function(_pool){
  pool = _pool;
});

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
  getVotebyReference:getVotebyReference,
  getVotesbyChoice:getVotesbyChoice,
  getAllVotes:getAllVotes,
  addVote:addVote,
  updateVote:updateVote,
  deleteVote:deleteVote
};

/*
  Functions in controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getVotebyReference(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var referenceNumber = req.swagger.params.referenceNumber.value || 'stranger';
        console.log("[INF]", "Getting vote by Refernece Number: " + referenceNumber);

        
        var vote;        

		mySQLDB.getVoteByReferenceNumber(referenceNumber, function(err, body){
		    if(err){
		      res.status(500).json(err);
		    }else{
		      if(body.length != 0){
		        console.log("[INF]", "Got vote by: "  + " refernece " + util.inspect(body));
		  
		        vote = body[0];
		        console.log(util.inspect(vote));
		        res.json(vote);
		      }else{
		        res.status("404").json("Not found")
		      }
		    }
		});

}


function getVotesbyChoice(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var voterChoice = req.swagger.params.voterChoice.value || 'stranger';
  		voterChoice = decodeURI(voterChoice);
        console.log("[INF]", "Getting votes by choice: " + voterChoice);
  
	mySQLDB.getVotesbyChoice(voterChoice, function(err, body){	
	    if(err){
	    	console.log("Error Calling ")
	      res.status(500).json(err);
	    }else{
	      res.json(body);
	    };
	});


}

function getAllVotes(req, res) {
  // No variables defined in the Swagger document can be referenced using   
	console.log("[INF]", "allVotes : started");
	mySQLDB.getVotesbyChoice("", function(err, body){
	    if(err){
	    	console.log("[INF]", "allVotes : error returened", util.inspect(err));
	      res.status(500).json(err);
	    }else{
	    	console.log("[INF]", "allVotes : no error");	    	
	      res.json(body);
	    };
	});

}


function addVote(req, res){
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var vote = req.body;
 
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
  console.log("Start Database : " + ( new Date().toISOString())) ; 
  mySQLDB.getVoteByReferenceNumber(vote.referenceNumber, function(err, body){
	  console.log("End Database : " + ( new Date().toISOString())) ; 
	  if (err){

          console.log('[vote.insert while checking for record existence] ', err.message);
          res.status(500).json(err);	 		  
	  }
	  else {
		//      console.log("[INF] Query Error", err.message);	  
		      console.log("[INF] Query Return", body);
		 	    if(!err && body.length != 0){

		
				  var msg = "Vote with  refernece " + vote.referenceNumber + "\" already exists.";
				      console.log("[ERR]", msg);
				      res.status("405").json(msg);
				    }
		 	    else{
				      mySQLDB.addVote(vote, function(err, body){
				        if (err) {
				          console.log('[vote.insert] ', err.message);
				          res.status(500).json(err);	
				        }
				        else {
					        console.log("[INF]", 'Vote added.')
					        var newPayment = body;
					        console.log(newPayment);
					        res.json(newPayment);
				        }
				      });      
				 };
	   } 	    
	  })

};

function updateVote(req, res){
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var newVote = req.body;
  var vote;
    
     var referenceNumber = req.swagger.params.referenceNumber.value ;
       console.log("[INF]", "Upate Vote Reference  : " + referenceNumber) ;
       
       
		mySQLDB.getVoteByReferenceNumber(referenceNumber, function(err, body){
    	   if (err) {
    	          console.log('[vote.update while checking for record existence] ', err.message);
    	          res.status(500).json(err);		 		  
    	   }
    	   else {
		         if(body.length != 0){
		           console.log("[INF]", util.inspect(body));
		           vote = body[0];
		           
		           vote.referenceNumber = newVote.referenceNumber || vote.referenceNumber;
		           vote.name = newVote.name || vote.name;
		           vote.email = newVote.email || vote.email;           
		           vote.phone = newVote.phone || vote.phone;
		           vote.voterChoice = newVote.voterChoice || vote.voterChoice;
		           vote.votetimeStamp = newVote.votetimeStamp || vote.votetimeStamp;
		           
				   mySQLDB.updateVote(vote, function(err, body){
		             if (err) {
		               console.log('[payment.update] ', err.message);
		               return;
		             }
		             console.log("[INF]", 'Payment updated.')
		             newVote = body;
		             console.log(newVote);
		             res.json(newVote);
		           });
		         }else{
		           res.status("404").json("Not found")
		         };
    	   }     
       });

};

function deleteVote(req, res){
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
     var referenceNumber = req.swagger.params.referenceNumber.value ;
       console.log("[INF]", "Delete Vote Reference  : " + referenceNumber) ;
 
       var vote;
       
		mySQLDB.getVoteByReferenceNumber(referenceNumber, function(err, body){
       
    	   if (err) {
               console.log("[ERR]", err.message);
               res.status(500).json(err.message);    		   
    		   
    	   }
    	   else {
		         if(body.length != 0){
		           vote = body[0];
				   mySQLDB.deleteVote(vote.referenceNumber, function(err, body){
		             if(err){
		               var message = "Error deleting vote with ID: \"" + vote.referenceNumber;
		               console.log("[ERR]", message);
		               console.log(err);
		               res.status(500).json(message);
		             }else{
		               res.status(200).json();
		             };
		           });
		         }else{
		           res.status("404").json("Not found")
		         }
    	   }    
       });

};
