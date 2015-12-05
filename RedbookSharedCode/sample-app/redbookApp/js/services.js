angular.module('starter.services', ['ngResource'])

.factory('Session', function ($resource) {
    return $resource('http://localhost:5000/sessions/:sessionId');
})

.factory('Vote',['$http', function($http){
    return {
        getChoice:function(baseUrl, voterChoice){

        	if (!voterChoice || (voterChoice == "") || (voterChoice == "All")  ){
        		url = baseUrl + '/vote';
        	}
        	else {
        		url = encodeURI(baseUrl + '/votebyChoice/' + voterChoice) ;
        	}
        	console.log ("url for Choice " + url);	
        	return $http.get(url).then(function(response){

        		var temp = response;
    			console.log("Value from Votes by Voter Choice List Service", temp);
    			return temp;
    		});
        },

        create:function(baseUrl, data){
        	console.log("Object to string", JSON.stringify(data));
        	url = baseUrl + '/recordVote'
        	console.log ("url for recording vote " + url);	
        	return $http.post(url, data
        //    		, {
        //    		headers: {
        //    				'Content-Type':'application/json'
        //    			 }
        //    }
        ).then(function(response){
    			var temp = response;
    			console.log("Value from Add Service", temp);
    			return temp;
    		});
        },
 
        getNew:function(){
        	var temp ={"voterChoice" : "Indian"};
        	return temp;        	
        }
    }
}]).factory('Vote2',['$http', function($http){
    return {
        getChoice:function(serviceUrl, voterChoice){

        	if (!voterChoice || (voterChoice == "") || (voterChoice == "All")  ){
        		url = serviceUrl;
        	}
        	else {
        		url = encodeURI(serviceUrl  + voterChoice) ;
        	}
        	console.log ("url for Choice " + url);	
        	return $http.get(url).then(function(response){

        		var temp = response;
    			console.log("Value from Votes by Voter Choice List Service", temp);
    			return temp;
    		});
        },

        getResults:function(baseUrl){

        	
        		url = encodeURI(baseUrl  + '/result') ;
        
        	console.log ("url for Result " + url);	
        	return $http.get(url).then(function(response){

        		var temp = response;
    			console.log("Value from Voting Results", temp);
    			return temp;
    		});
        },
        
        
        
        
        create:function(baseUrl, data){
        	console.log("Object to string", JSON.stringify(data));
        	url = baseUrl + '/recordVote'
        	console.log ("url for recording vote " + url);	
        	return $http.post(url, data
        //    		, {
        //    		headers: {
        //    				'Content-Type':'application/json'
        //    			 }
        //    }
        ).then(function(response){
    			var temp = response;
    			console.log("Value from Add Service", temp);
    			return temp;
    		});
        },
 
        getNew:function(){
        	var temp ={"voterChoice" : "Indian"};
        	return temp;        	
        }
    }
}]);

