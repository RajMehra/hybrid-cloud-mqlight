//angular.module('starter.controllers', [])
angular.module('starter.controllers', ['starter.services'])
.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
//    communicationService.setCustomerNumber($scope.loginData.username);
//    console.log('Customer Number', communicationService.getCustomerNumber());
//    console.log('Root Scope Login', $rootScope);
    
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('VoteController', function($rootScope, $scope, $state, $stateParams, Vote,  $http ) {
	var url;
	  $http.get('connection.properties').then(function (response) {
		    console.log('base url is ', response.data.baseUrl);
		    $scope.baseUrl = response.data.baseUrl;
		    console.log('service url is ', response.data.serviceUrl);
		    $scope.serviceUrl = response.data.serviceUrl;
		    
		  });
	$scope.vote =  Vote.getNew(); 

	$scope.refresh = function () {
		  $scope.vote =  Vote.getNew();  //create new movie instance. Properties will be set via ng-model on UI
		 
		
		  console.log('Adding Vote up object', $scope.vote); 
	};
	$scope.addVote = function() { 
		console.log("Saving Object :", $scope.vote);
		  $http.get('connection.properties').then(function (response) {
			    console.log('base url is ', response.data.baseUrl);
			    $scope.baseUrl = response.data.baseUrl;
			    console.log('service url is ', response.data.serviceUrl);
			    $scope.serviceUrl = response.data.serviceUrl;
			    
			    Vote.create($scope.baseUrl, $scope.vote).then(function(data){
					$scope.message = "Thank you for your voting " + data.data.name  + " your vote recorded at " + data.data.votetimeStamp ;
					console.log("Vote Added :", $scope.vote);
					$scope.vote =  Vote.getNew(); 
					
//					$state.go('app.votes');
			    });
			    
			    
		});
		

};
}).controller('VoteListController', function($rootScope, $scope, $state, $window, $interval, Vote2, $http) {

	if (!$scope.selection) {
		$scope.selection = {
				"voterChoice" : "All"
		};
	}
	

	  
	$scope.refresh = function () {
		$scope.message = "";
		$http.get('connection.properties').then(function (response) {
		    console.log('base url is ', response.data.baseUrl);
		    $scope.baseUrl = response.data.baseUrl;
		    console.log('service url is ', response.data.serviceUrl);
		    $scope.serviceUrl = response.data.serviceUrl;
		    Vote2.getChoice($scope.serviceUrl, $scope.voterChoice).then(function(data){
					$scope.votes=data.data;	
			    }); 
		  });
	    };    	
  
	$scope.showSelectValue = function(newVal)    {
		console.log("Changed Value " + newVal);
		$scope.voterChoice = newVal;
		$scope.refresh();
	}
	    
	    
	//$interval($scope.refresh(),1000,true);
//	setInterval(function(){
//		$scope.refresh();
//		$scope.$apply();
//	},5000)

	$scope.refresh();
		
	$scope.castVote = function() {
		$state.go("app.vote");	
		console.log("Adding Vote");	
	};


}).controller('ResultListController', function($rootScope, $scope, $state, $window, $interval, Vote2, $http) {

	if (!$scope.selection) {
		$scope.selection = {
				"voterChoice" : "All"
		};
	}
	

	  
	$scope.refresh = function () {
		$scope.message = "";
		$http.get('connection.properties').then(function (response) {
		    console.log('base url is ', response.data.baseUrl);
		    $scope.baseUrl = response.data.baseUrl;
		    console.log('service url is ', response.data.serviceUrl);
		    $scope.serviceUrl = response.data.serviceUrl;
		    Vote2.getResults($scope.baseUrl).then(function(data){
					$scope.results=data.data;	
			    }); 
		  });
	    };    	
   
	    
	//$interval($scope.refresh(),1000,true);
//	setInterval(function(){
//		$scope.refresh();
//		$scope.$apply();
//	},5000)

	$scope.refresh();
		
	$scope.castVote = function() {
		$state.go("app.vote");	
		console.log("Adding Vote");	
	};


});



