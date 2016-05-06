var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
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

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})



app.controller('TodolistCtrl', function($scope, $state, AllLists, Shared) {
	console.log("TodolistCtrl - ctrl reached"); 
	
	$scope.newList = {};
	$scope.editedList = {};
	
    function findAllLists() {
    	
    	console.log("findAllLists - 2 be executed"); 
    	AllLists.get({}, 
    			function success(response) {
    				if (response._embedded != undefined) {
	    				$scope.alllists = response._embedded.tbllists;
	    				console.log("TodolistCtrl.findAllLists success::"+ JSON.stringify($scope.alllists));
    				}
    			},
    		    function error(errorResponse) {
    				console.log("TodolistCtrl.findAllLists Error:" + JSON.stringify(errorResponse));
    		    }
    	);
    }

    function findList(list_id) {
    	var retList = {};
    	console.log("findList - 2 be executed for listid:"+list_id); 
    	AllLists.get({id:list_id}, 
    			function success(response) {
    		console.log("findList - response:"+JSON.stringify(response)); 
    				if (response != undefined) {
    					retList = response;
	    				console.log("TodolistCtrl.findList success::"+ JSON.stringify(retList));
	    				return retList;
    				}
    			},
    		    function error(errorResponse) {
    				console.log("TodolistCtrl.findList Error:" + JSON.stringify(errorResponse));
    				return null;
    		    }
    	);
    }

    function saveList(list) {
    	AllLists.save(list,
    			function success(resp) {
    				list.id = resp.id;
    				list.name = resp.name;
    				console.log("TodolistCtrl.save success on ID-Name:"+ list.id + "-" + list.name);
    				 findAllLists();
    			}, function error(errorResponse) {
    				//angular.copy(originalTodos, store.todos);
    				console.log("TodolistCtrl.saveList Error:" + JSON.stringify(errorResponse));
    			})
    }

    function deleteList(list) {
    	AllLists.remove({ id: list.listid },
    			function success(resp) {
    				console.log("TodolistCtrl.remove success on ID-Name:"+ list.listid + "-" + list.name);
    				 //findAllLists();
    			}, function error(errorResponse) {
    				//angular.copy(originalTodos, store.todos);
    				console.log("TodolistCtrl.remove Error:" + JSON.stringify(errorResponse));
    			})
    }
    
    

	//add a new task
	$scope.addList = function addList() {
		console.log("addList begin: name1:" + $scope.newList.name);
		if($scope.newList.name==""){
			alert("Insufficient Data! Please provide values for list name, ID");
		}
		else {
//			$scope.newList = {};
			var insList = {
					name: $scope.newList.name,
					id: $scope.newList.id
					};
			console.log("addList set name in form:" + $scope.newList.name + " name 2 add "+insList.name);;

//			console.log("addList given values name:" + newList.name);
			$scope.alllists.push(insList);
			console.log("addList pushed newList");
			saveList(insList);	
			console.log("addList saved newList");
			 // Refetching EVERYTHING every time can get expensive over time
             // Better solution would be to $http.get(headers()["location"]) and add it to the list
            
		    };
	};

	$scope.removeList = function removeList(list) {
		console.log("removeList for:" + list.name + "ID:"+list.listid);

		$scope.alllists.splice($scope.alllists.indexOf(list), 1);
		console.log("removeList splice:" + list.name);
		deleteList(list);
		console.log("removeList for:" + list.name);
		};
		
	$scope.updateList = function (list) {
		console.log("updateList for :"+ JSON.stringify(list));
		var updList = AllLists.get({id:list.listid},function() {
			updList.name = $scope.editedList.name;
			updList.$update(function() {
				console.log("updateList - List("+list.lisid+") name updated to "+ $scope.editedList.name);
			});
			
		})
		
//		
//		console.log("updateList for :"+ JSON.stringify(list));
//		updList = findList(list.listid);
//		updList.name = $scope.editedList.name;
//		AllLists.update({ id: list.listid }, updList);
//		console.log("updateList updList is :"+ JSON.stringify(updList));
	};	
		
/* trial navigate to another state & controller on edit, Problem navigation to other view
 * does not work
 
		$scope.goedit = function(listid) {
		console.log("goedit: to state app.todolist with listid:"+listid);
	    $state.go('app.todolist',{id:listid});
	    Shared.refresh = false;
	    Shared.editListId = listid;
	};	
*/

	$scope.setSelected = function(index) {
		console.log("setSelected: selected index is:"+index);
		$scope.selectedIdx = index;
	}
	
	console.log("Ctrl: refresh:"+ Shared.refresh);
	if (Shared.refresh == true) {
	    findAllLists();		
	} 
//	    else {
//		if (Shared)
//	}

    
});

app.controller('TodolistEditCtrl', function($scope, $state, AllLists, Shared) {
	console.log("TodolistEditCtrl - ctrl reached"); 


    function findList(listid) {
    	
    	console.log("findList - 2 be executed"); 
    	AllLists.get({id:listid}, 
    			function success(response) {
    				if (response._embedded != undefined) {
	    				$scope.editlist = response._embedded.tbllists;
	    				console.log("TodolistEditCtrl.findList success::"+ JSON.stringify($scope.editlists));
    				}
    			},
    		    function error(errorResponse) {
    				console.log("TodolistEditCtrl.findList Error:" + JSON.stringify(errorResponse));
    		    }
    	);
    }
	
    $scope.listId = Shared.editListId;
    console.log("editlistId." + $scope.listId);

});

