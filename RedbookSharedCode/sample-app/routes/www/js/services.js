angular.module('starter.services', ['ngResource'])

.factory('Session', function ($resource) {
    return $resource('http://localhost:5000/sessions/:sessionId');
})
.factory('Paymentx', function ($resource) {
//    return $resource('http://localhost:10010/v1/scheduledPayments/:customerNumber/:referenceNumber' 
    return $resource('http://localhost:10010/v1/scheduledPayments' 
    				      		
//    		, { customerNumber: 'customerNumber', referenceNumber: 'referenceNumber' }, {
//    		    update: {
//    		      method: 'PUT' // this method issues a PUT request
//    		    }
//    		  }
    
    );
})
.factory('Payment',['$http', function($http){
    return {
        getAll:function(){
        	return $http.get('http://rm3-smart-payments-api-dev.mybluemix.net/v1/scheduledPayments').then(function(response){
    			var temp = response;
    			console.log("Value from Payments List Service", temp);
    			return temp;
    		});
        },
        getCustomer:function(customerNumber){
        	return $http.get('http://rm3-smart-payments-api-dev.mybluemix.net/v1/scheduledPayments/'+customerNumber).then(function(response){
    			var temp = response;
    			console.log("Value from Payments by  Customer List Service", temp);
    			return temp;
    		});
        },
        get:function(customerNumber, referenceNumber){
            return $http.get('http://rm3-smart-payments-api-dev.mybluemix.net/v1/scheduledPayments/'+customerNumber +'/' + referenceNumber).then(function(response){
    			var temp = response;
    			console.log("Value from Payment Service", temp);
    			return temp;
    		});
        },
        create:function(data){
        	console.log("Object to string", JSON.stringify(data));
            return $http.post('http://rm3-smart-payments-api-dev.mybluemix.net/v1/scheduledPayments', data
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
        edit:function(customerNumber, referenceNumber,data){
        	var urlPut = 'http://rm3-smart-payments-api-dev.mybluemix.net/v1/scheduledPayments/?customerNumber=' + customerNumber + '&referenceNumber=' + referenceNumber;
            return $http.put(urlPut,data
        //    	,{
        //		headers: {
    	//			'Content-Type':'application/json'
    	//		 }
        //    }
        ).then(function(response){
            	var temp = response;
            	console.log("Value from Edit Service", temp);
            	return temp;
            });
        },
        delete:function(customerNumber, referenceNumber){
        	var urlDelete = 'http://rm3-smart-payments-api-dev.mybluemix.net/v1/scheduledPayments/?customerNumber=' + customerNumber + '&referenceNumber=' + referenceNumber;        	
            return $http.delete(urlDelete).then(function(response){
            	var temp = response;
            	console.log("Value from Delete Service", temp);
            	return temp;
            });
        },
        getCustomerBalance:function(customerNumber){
        	return $http.get('http://rm3-smart-payments-api-dev.mybluemix.net/v1/accountBalance/'+customerNumber).then(function(response){
    			var temp = response;
    			console.log("Value from Balances by  Customer List Service", temp);
    			return temp;
    		});
        },
        getNew:function(){
        	temp = {};
        	temp.priority="3";
        	temp.payRule="standard";
        	temp.payStatus="open";
        	console.log(temp);
        	return temp;        	
        }
    }
}])

.factory('Balances',['$http', function($http){
    return {
        
        getCustomer:function(customerNumber){
        	return $http.get('http://rm3-smart-payments-api-dev.mybluemix.net/v1/accountBalance/'+customerNumber).then(function(response){
    			var temp = response;
    			console.log("Value from Balances by  Customer List Service", temp);
    			return temp;
    		});
        },
        getNew:function(){
        	temp = {};
        	temp.priority="3";
        	temp.payRule="standard";
        	temp.payStatus="open";
        	console.log(temp);
        	return temp;        	
        }
    }
}])


.service('communicationService', function() {
  var customerNumber = "AwesomeMelon";
  var referenceNumber = "BBB";

  var setCustomerNumber = function(newObj) {
	  console.log("Setting Customer Number to service " + newObj);
	  customerNumber = newObj;
  };

  var getCustomerNumber = function(){
	  console.log("Getting Customer Number from service " + customerNumber);
      return customerNumber;
  };
 
  var setReferenceNumber = function(newObj) {
	  console.log("Setting Reference Number to service " + newObj);
	  referenceNumber = newObj;
  };

  var getReferenceNumber = function(){
	  console.log("Getting reference Number from service " + referenceNumber);
      return referenceNumber;
  };
  

  return {
	  setCustomerNumber: setCustomerNumber,
	  getCustomerNumber: getCustomerNumber,
	  setReferenceNumber: setReferenceNumber,
	  getReferenceNumber: getReferenceNumber
  };

});
