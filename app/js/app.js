'use strict';

var appDependencies = [ 
  'ngRoute',
  'ngResource',  
  'ui.bootstrap',
  'ui.date',
  'ngCpfCnpj',
  'angularFileUpload',
  'crudApp.filters',
  'crudApp.services',
  'crudApp.directives',
  'crudApp.controllers'   
];

// Declare app level module which depends on filters, and services
var crudApp = angular.module('crudApp', appDependencies);


crudApp.config(['$routeProvider','$sceDelegateProvider','$httpProvider', function($routeProvider, $sceDelegateProvider,$httpProvider) {
  $routeProvider.when('/vw-list-user', {templateUrl: 'partials/list-user.html', controller: 'ListController'});
  $routeProvider.when('/vw-detail-user/:id', {templateUrl: 'partials/detail-user.html', controller: 'DetailController'});
  $routeProvider.when('/vw-create-user', {templateUrl: 'partials/create-user.html', controller: 'CreateController'});

  $routeProvider.when('/vw-solicitacao-form', {templateUrl: 'partials/solicitacao-form.html', controller: 'SolicitacaoController'});

  $routeProvider.when('/vw-upload-foto', {templateUrl: 'partials/upload-foto.html', controller: 'UploadFotoController'});

  
  $routeProvider.otherwise({redirectTo: '/vw-list-user'});

  $httpProvider.interceptors.push('httpInterceptor');
  
  
  //Coloca o dominio numa whitelist do Angular
  /*
  $sceDelegateProvider.resourceUrlWhitelist([
     'self', 
     'http://localhost:9000/*', 
     'http://localhost:8180/*'     
    ]);
   */
  
  //requisições AJAX são enviadas com o cabeçalho [X-Requested-With]
  //É necessario excluir p/ q o server não rejeite a requisição
  /*
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];  
  */
  
}]);

//crudApp.config([]);