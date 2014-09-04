'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

/**
angular.module('crudApp.services', []).
  value('version', '0.0.1');
**/

var URL_REST_API_DOMAIN = 'http://rest-api-conline.herokuapp.com';
var PORT_REST_API = '80';

var URL_REST_API_BASE = URL_REST_API_DOMAIN + ':' + PORT_REST_API + '/';


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

	console.log('URL_REST_API_BASE: ' + URL_REST_API_BASE+'campus');	

	//var campusResult = $resource('http://localhost:9000/campus', {}, {

	var campusResult = $resource( URL_REST_API_BASE+'campus', {}, {	
		query: {
			method: 'GET',
			params: {},
			isArray: true
		}
	});

	return campusResult;

});



crudService.factory('EstadoRest', function($resource){

	var estadosResult = $resource(URL_REST_API_BASE+'estados', {}, {
		query: {
			method: 'GET',
			params: {},
			isArray: true
		}
	});

	return estadosResult;

});


crudService.factory('SolicitacaoRest', function($resource){

	//var solicitacaoResult = $resource('http://localhost:9000/solicitacao', {}, {
	var solicitacaoResult = $resource(URL_REST_API_BASE+'solicitacao', {}, {		
		create: {
			method: 'POST'							
		}
	});

	return solicitacaoResult;

});

crudService.factory('httpInterceptor', function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return $q.reject(response);
        }
    };
});


/**
crudService.factory('UserPojo', function($resource){

	return $resource('http://localhost:9000/users',{},{
		`query:{method: 'GET', params: {}, isArray: true}
	})
});
**/


