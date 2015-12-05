/**
 * New node file
 */

var _db;
var util = require('util');
var cfEnv = require('cfenv');
var mysql      = require('mysql');
var appEnv = cfEnv.getAppEnv();

var _dbNameBase = "sample"
var env = process.env.ENV || "test";
var dbHost = process.env.DBHOST || "<virtual address of the MYSQL Server>";
var dbPort = process.env.DBPORT || 3306;
var dbName = process.env.DBNAME || "redbook";
var dbUser = process.env.DBUSER || "admin";
var dbPassword = process.env.DBPASSWORD || "passw0rd";




var _dbName = _dbNameBase + (env ? "-" + env : "");

var key = "key";

                 
var _connPool =  mysql.createPool({
	host : dbHost,
	port : dbPort,
	database : dbName,
	password : dbPassword,
	user : dbUser
});


console.log("[INF]", "Conn Pool\n" + util.inspect(_connPool));


// Export definitions


function db(callback){
  _db = nano.use(dbName);
  callback(_db);
};

function pool(callback){
	  callback(_connPool);
};


function getVoteByReferenceNumber(referenceNumber, callback){
 
	  console.log("[INF]", "finding Vote by referneceNumber :" + referenceNumber );
	  var qryString = "select referenceNumber,name,email,phone,voterChoice,votetimeStamp from VOTES where referenceNumber = '" + referenceNumber +"'";

	    _connPool.getConnection(function(err,connection){
	        if (err) {
	    		console.log("[INF]", "getVotesbyReference : err getting connection");		
	          callback(err);
	        }   
	        else { 
//		        console.log("[INF]", "Connection \n" + util.inspect(connection));
		        connection.query(qryString,function(err,rows){
	
			        
		            connection.release();
//			        console.log("[INF]", "Connection released" + util.inspect(connection));	  
		            if(!err) {
				        console.log("[INF]", "Rows \n" + util.inspect(rows));	
		                callback(err, rows);
		            }   
		            else{
		            	callback(err);
		            }
		        });
	        }
	  });
	  
};

function getVotesbyChoice(voterChoice, callback){
		console.log("[INF]", "getVotesbyChoice : started ", voterChoice );
		var qryString;
		if (voterChoice){
			qryString = "select referenceNumber,name,email,phone,voterChoice,votetimeStamp from VOTES where voterChoice = '" + voterChoice + "' order by votetimeStamp DESC";

		}
		else {
			qryString = "select referenceNumber,name,email,phone,voterChoice,votetimeStamp from VOTES order by votetimeStamp DESC";			
		}
		console.log("[INF]", "getVotesbyChoice : qryString", qryString );	
	    _connPool.getConnection(function(err,connection){
	        if (err) {
	    	   console.log("[INF]", "getVotesbyChoice : err getting connection");		
	           callback(err);
	        }   
	        else {
//		        console.log("[INF]", "Connection \n" + util.inspect(connection));
		        connection.query(qryString,function(err1,rows){
	
			        
		            connection.release();
//			        console.log("[INF]", "Connection released" + util.inspect(connection));	  
		            if(!err) {
				        console.log("[INF]", "Rows \n" + util.inspect(rows));	
		                callback(err1, rows);
		            }   
		            else{
		            	callback(err1);
		            }
		        });
	        };

	       }) ;
};
		

function addVote(vote, callback){
				 
		console.log("[INF]", "adding a vote : " + util.inspect(vote) );

		var qryString = "INSERT INTO VOTES (referenceNumber,name,email,phone,voterChoice,votetimeStamp) VALUES ('" + vote.referenceNumber + "', '" + vote.name + "', '" + vote.email + "', '" + vote.phone + "', '" + vote.voterChoice +  "', '" +  vote.votetimeStamp +"')";
		
		console.log("[INF]", "getVotesbyChoice : qryString", qryString );	
	    _connPool.getConnection(function(err,connection){
	        if (err) {
	    	   console.log("[INF]", "addVote : err getting connection");		
	           callback(err);
	        }   
	        else {
//		        console.log("[INF]", "Connection \n" + util.inspect(connection));
		        connection.query(qryString,function(err,rows){
	
			        
		            connection.release();
//			        console.log("[INF]", "Connection released" + util.inspect(connection));	  
		            if(!err) {
				        console.log("[INF]", "Rows \n" + util.inspect(rows));	
		                callback(err, vote);
		            }   
		            else{
		            	callback(err);
		            }
		        });
	        };

	       }) ;
};
			
function updateVote(vote, callback){
	 
	console.log("[INF]", "updating a vote : " + util.inspect(vote) );

	var qryString = "Update VOTES  set name  = '" + vote.name + "', email = '" + vote.email + "', phone = '" + vote.phone + "' , voterChoice = '" + vote.voterChoice + "', votetimeStamp = '" + vote.votetimeStamp + "' where referenceNumber = '" + vote.referenceNumber +"'";
	
	console.log("[INF]", "getVotesbyChoice : qryString", qryString );	
    _connPool.getConnection(function(err,connection){
        if (err) {
    	   console.log("[INF]", "updateVote : err getting connection");		
           callback(err);
        }   
        else {
//	        console.log("[INF]", "Connection \n" + util.inspect(connection));
	        connection.query(qryString,function(err,rows){

		        
	            connection.release();
//		        console.log("[INF]", "Connection released" + util.inspect(connection));	  
	            if(!err) {
			        console.log("[INF]", "Rows \n" + util.inspect(rows));	
	                callback(err, vote);
	            }   
	            else{
	            	callback(err);
	            }
	        });
        };

       }) ;
};

function deleteVote(referenceNumber, callback){
	 
	console.log("[INF]", "deleting a vote with referenceNumber : " + referenceNumber );

	var qryString = "DELETE from VOTES where referenceNumber = '"  + referenceNumber + "'" ;
	
	console.log("[INF]", "deleteVote  : qryString", qryString );	
    _connPool.getConnection(function(err,connection){
        if (err) {
    	   console.log("[INF]", "deleteVote : err getting connection");		
           callback(err);
        }   
        else {
//	        console.log("[INF]", "Connection \n" + util.inspect(connection));
	        connection.query(qryString,function(err,rows){

		        
	            connection.release();
//		        console.log("[INF]", "Connection released" + util.inspect(connection));	  
	            if(!err) {
			        console.log("[INF]", "Response from delete \n" + util.inspect(rows));	
	                callback(err, referenceNumber);
	            }   
	            else{
	            	callback(err);
	            }
	        });
        };

       }) ;
};



			
module.exports = {
    db: db,
    pool: pool,   
    updateVote : updateVote,
    getVotesbyChoice: getVotesbyChoice,
    getVoteByReferenceNumber : getVoteByReferenceNumber,
    deleteVote : deleteVote,
    addVote: addVote
    
  };
