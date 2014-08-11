'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

/**
angular.module('crudApp.services', []).
  value('version', '0.0.1');
**/

var crudService = angular.module('crudApp.services', ['ngResource']);

crudService.factory('UserPojo', function($resource){
	
	var result = $resource('http://localhost:9000/users/:id', {id:'@id'}, {
		query: {
			method: 'GET',
			params: {},
			isArray: true
		},
		get: {
			method: 'GET', 
			params: {id:'idUser'},
			isArray: false
		},
		create: {
			method: 'POST'							
		},

		update: {
			method: 'PUT',
			params: {id:'@id'} 			
		}, 
		delete: {
			method: 'DELETE',
			params: {id:'@id'},
			isArray: false
		}
	});
	
	return result;
});


crudService.factory('CampusRest', function($resource){

	var campusResult = $resource('http://localhost:9000/campus', {}, {
		query: {
			method: 'GET',
			params: {},
			isArray: true
		}
	});

	return campusResult;

});



crudService.factory('EstadoRest', function($resource){

	var estadosResult = $resource('http://localhost:9000/estados', {}, {
		query: {
			method: 'GET',
			params: {},
			isArray: true
		}
	});

	return estadosResult;

});


crudService.factory('SolicitacaoRest', function($resource){

	var solicitacaoResult = $resource('http://localhost:9000/solicitacao', {}, {
		create: {
			method: 'POST'							
		}
	});

	return solicitacaoResult;

});


/**
crudService.factory('UserPojo', function($resource){

	return $resource('http://localhost:9000/users',{},{
		`query:{method: 'GET', params: {}, isArray: true}
	})
});
**/


