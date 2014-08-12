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
      dateFormat: 'dd/mm/yy'      
    };

    $scope.campusList = CampusRest.query();

    $scope.estadoList = EstadoRest.query();

  $scope.salvarUser = function(){
    
    console.log($scope.solicitacao);

    SolicitacaoRest.create($scope.solicitacao);
                                
  };
}]);


crudApp.controller('UploadFotoController', ['$scope', '$http', '$timeout', '$upload', function($scope, $http, $timeout, $upload){

var uploadUrl = 'http://localhost:9000/upload/foto/'; 
var KEY_MULTIPARTI_FILE_UPLOAD_FOTO = 'fotoFile';
var HTTP_METHOD = 'POST';
//Multupart/form-data ou File binary
var howToSend = 1;


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  $scope.uploadUrl = uploadUrl;

  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
  $scope.uploadRightAway = false;
  
    
  $scope.hasUploader = function(index) {
    return $scope.upload[index] != null;
  };

  $scope.abort = function(index) {
    $scope.upload[index].abort(); 
    $scope.upload[index] = null;
  };

  $scope.onFileSelect = function($files) {
    $scope.selectedFiles = [];
    $scope.progress = [];
    if ($scope.upload && $scope.upload.length > 0) {
      for (var i = 0; i < $scope.upload.length; i++) {
        if ($scope.upload[i] != null) {
          $scope.upload[i].abort();
        }
      }
    }
    $scope.upload = [];
    $scope.uploadResult = [];
    $scope.selectedFiles = $files;
    $scope.dataUrls = [];
    for ( var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL($files[i]);
        var loadFile = function(fileReader, index) {
          fileReader.onload = function(e) {
            $timeout(function() {
              $scope.dataUrls[index] = e.target.result;
            });
          }
        }(fileReader, i);
      }
      $scope.progress[i] = -1;

      //Quando marcado, Ao selecionar um arquivo, Inicia AUTOMATICAMENTE a transferencia
      if ($scope.uploadRightAway) {
        $scope.start(i);
      }
    }
  };
  
  $scope.start = function(index) {
    $scope.progress[index] = 0;
    $scope.errorMsg = null;

    var urlUploadWithCPF = uploadUrl + $scope.myModel;

    $scope.uploadUrl = urlUploadWithCPF;

    if (howToSend == 1) {  //if ($scope.howToSend == 1) {
      $scope.upload[index] = $upload.upload({
        url: urlUploadWithCPF,
        method: HTTP_METHOD, //$scope.httpMethod,
        //headers: {'my-header': 'my-header-value'},
        data : {
          myModel : $scope.myModel
        },

        /* formDataAppender: function(fd, key, val) {
          if (angular.isArray(val)) {
                        angular.forEach(val, function(v) {
                          fd.append(key, v);
                        });
                      } else {
                        fd.append(key, val);
                      }
        }, */
        /* transformRequest: [function(val, h) {
          console.log(val, h('my-header')); return val + '-modified';
        }], */

        file: $scope.selectedFiles[index],
                
        //fileFormDataName: 'fotoFile'                  
        fileFormDataName: KEY_MULTIPARTI_FILE_UPLOAD_FOTO
        
      });
      $scope.upload[index].then(function(response) {
        $timeout(function() {
          $scope.uploadResult.push(response.data);
        });
      }, function(response) {
        if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
      }, function(evt) {
        // Math.min is to fix IE which reports 200% sometimes
        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
      $scope.upload[index].xhr(function(xhr){
//        xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
      });

    //FILE BINARY OPTION
    } else {
      var fileReader = new FileReader();
            fileReader.onload = function(e) {
            $scope.upload[index] = $upload.http({
              url: uploadUrl,
          headers: {'Content-Type': $scope.selectedFiles[index].type},
          data: e.target.result
            }).then(function(response) {
          $scope.uploadResult.push(response.data);
        }, function(response) {
          if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {
          // Math.min is to fix IE which reports 200% sometimes
          $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
            }
          fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
    }
  };
  
  $scope.dragOverClass = function($event) {
    var items = $event.dataTransfer.items;
    var hasFile = false;
    if (items != null) {
      for (var i = 0 ; i < items.length; i++) {
        if (items[i].kind == 'file') {
          hasFile = true;
          break;
        }
      }
    } else {
      hasFile = true;
    }
    return hasFile ? "dragover" : "dragover-err";
  };



}]);
