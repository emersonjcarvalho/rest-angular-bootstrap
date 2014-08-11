'use strict';

/* Controllers */

var crudApp = angular.module('crudApp.controllers', []);
 
crudApp.controller('ListController', ['$scope','UserPojo', '$location', function($scope, UserPojo, $location) {
		
   	$scope.UserList = UserPojo.query();

   	$scope.editarUser = function(idUsuario){   		
   		$location.path('/vw-detail-user' + '/' + idUsuario);
   	};

   	$scope.deleteUser = function(idUsuario){
   		//TODO DELETAR
   		//DEPOIS chamar list novamente
   	};

   	$scope.criarUser = function(){$location.path('/vw-create-user');};

  }]);



crudApp.controller('DetailController', ['$scope', 'UserPojo', '$routeParams', '$location', function ($scope, UserPojo, $routeParams, $location){


    $scope.testDate = function(){

      var d = moment($scope.aDate);      
      var newDate = d.format('YYYY-MM-DD');

      console.log('newDate: ' + newDate);
      alert('newDate: ' + newDate);

    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };    

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];    

    UserPojo.get({id:$routeParams.id}, function (userPojo) {
        $scope.user = userPojo;
    });
   
    $scope.atualizarUser = function(){

    	//update using POJOfactory
		UserPojo.update($scope.user);

    	//redirect to list
    	$location.path('/vw-list-user');   
    };
    

    //action [cancel] = redirect list
    $scope.cancelarUser = function(){$location.path('/vw-list-user');};    

}]);


crudApp.controller('CreateController', ['$scope','UserPojo', 'CampusRest', function($scope, UserPojo, CampusRest){

	//$scope.helloController = true; 
	//$scope.OnOff = function(){$scope.helloController = !$scope.helloController;};


  $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light'},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark'},
      {name:'yellow', shade:'light'}
    ];      

    $scope.campusList = CampusRest.query();

	$scope.salvarUser = function(){
                        
            UserPojo.create($scope.user);        
	};
}]);


crudApp.controller('SolicitacaoController', ['$scope','UserPojo', 'CampusRest', 'EstadoRest', 'SolicitacaoRest', function($scope, UserPojo, CampusRest, EstadoRest, SolicitacaoRest){

  //$scope.helloController = true; 
  //$scope.OnOff = function(){$scope.helloController = !$scope.helloController;};

    // datepicker options (ui-date)
    $scope.dateOptions = {
      changeYear: true,
      changeMonth: true,
      yearRange: '1900:+1', 
      //altField: "#alternate",
      //altFormat: "yy/mm/dd",
      //parseDate: 'yy/mm/dd',      
      //dateFormat: 'dd/mm/yy'      
    };

    $scope.campusList = CampusRest.query();

    $scope.estadoList = EstadoRest.query();

  $scope.salvarUser = function(){

    //var d = moment($scope.solicitacao.estudante.dataNascimento);      
    //var newDate = d.format('YYYY-MM-DD');

    
    //console.log(newDate);

    //console.log("--------------------------------");

    //var d = new Date();
    ///var n = d.toJSON();

    //console.log("n: " + n);

    //$scope.solicitacao.estudante.dataNascimento = n; //d.format('YYYY-MM-DD'); //new Date("1979-10-20");

    console.log($scope.solicitacao);


    SolicitacaoRest.create($scope.solicitacao);
    
                        
            //UserPojo.create($scope.user);        
  };
}]);