angular.module('starter.services', ['ngResource'])

.factory('AllLists', ['$resource', function($resource) {
	var dbURL = "http://localhost:8185/tbllists/:id";
	var shared = {
		refresh: true,
		editListId: 0
	}
	return $resource (dbURL,{}, {
		get: {method: 'GET', cache: false, isArray: false},
		update: { method:'POST' }
	});
}])

.factory('Shared', function() {

	var Shared = {
		refresh: true,
		editListId: 0
	};
	return Shared;
})


.factory('TodosPerList', ['$resource',  function($resource) {
	var dbURL = "http://localhost:8185/tbltodoes/search/findByTbllist_listid?listid=:listId";
	return $resource (dbURL,{listId:'@id'}, {
		get: {method: 'GET', cache: false, isArray: false}
	});
}])


// bisherige Lösung mit standard API
.factory('TasksPerTodo', ['$resource',  function($resource) {
//	var dbURL = "http://localhost:8185/tbltasks/search/findByTbltodo_todoID?todoID=:todoId";
//	var dbURL = "http://localhost:8185/tbltasks/search/findByTodoID?todoid=:todoid";

	var dbURL = "http://localhost:8185/tbltasks/search/findByTbltodo_TodoID?todoid=:todoid";
		return $resource (dbURL,{todoId:'@id'}, {
		get: {method: 'GET', cache: false, isArray: false},
		update: {method: 'PUT', cache: false, isArray: false}
	});	
}])


