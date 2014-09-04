'use strict';

/* Controllers */

var URL_REST_API_DOMAIN = 'http://rest-api-conline.herokuapp.com';
var PORT_REST_API = '80';

var URL_REST_API_BASE = URL_REST_API_DOMAIN + ':' + PORT_REST_API + '/';


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
    

    $scope.campusList = CampusRest.query();

	$scope.salvarUser = function(){
                        
            UserPojo.create($scope.user);        
	};
}]);


crudApp.controller('SolicitacaoController', ['$scope','UserPojo', 'CampusRest', 'EstadoRest', 'SolicitacaoRest', function($scope, UserPojo, CampusRest, EstadoRest, SolicitacaoRest){

  var MSG_SOLICITACAO_SUCESSO = 'Solicitacao efetuada com sucesso.';
  var MSG_REDIRECIONANDO_GATEWAY_PAGAMENTO = 'Aguarde alguns instantes.. Você está sendo redirecionado para o PagSeguro.';
  $scope.flagSolicitacaoSuccess = false;

  $scope.tipoFotoAceito = "'image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp'"; 
  $scope.tipoDocumentoAceito = "'image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'"; 

  $scope.alerts = [];
  $scope.regexSomenteNumeros =  /^[0-9]+$/;

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

    // ALERTS (Array and Actions) $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  
    $scope.messagesResult = [/* { type: 'success', msg: '... ngs up and try submitting again.' }, */];

    $scope.closeAlert = function(index) {
      $scope.messagesResult.splice(index, 1);
    };


  $scope.validarGeralForm = function(){    
    
    $scope.$broadcast('show-errors-check-validity');

  };  

  $scope.salvarUser = function(){

      $scope.$broadcast('show-errors-check-validity');


      if ($scope.formSolicitacao.$valid){

      //Default value for Instituicao
      $scope.solicitacao.estudante.idInstituicao = 1;
      $scope.solicitacao.estudante.localEntrega = 'c';


      //LIMPAR ALERTs erros before Save
      if($scope.messagesResult.length >=1 ){
        $scope.messagesResult.splice(0, $scope.messagesResult.length - 1);    
      }  
      
    //var retorno =  SolicitacaoRest.create($scope.solicitacao);

    //Resource.action([parameters], postData, [success], [error])

    SolicitacaoRest.create([], $scope.solicitacao
      , function(sucesso){
                              
          var sucessofromJson = angular.fromJson(sucesso);
                  
          //Alert w/ messagem de sucesso
          $scope.messagesResult.push({ type: 'success', msg: MSG_SOLICITACAO_SUCESSO}); 
          $scope.messagesResult.push({ type: 'success', msg: MSG_REDIRECIONANDO_GATEWAY_PAGAMENTO});    

          //REDIRECT to GateWay de Pagamento
          var delay = 5000;
          setTimeout(function(){ window.location = sucessofromJson['urlSolicitacaoSucesso'] ;}, delay);

        }

      , function(error){

         var errofromJson = angular.fromJson(error.data);
                           
            for (var i = 0; i < errofromJson.length; i++) {
              
              var erroList = errofromJson[i];
                          
              var messagemErroCampo = "";
              var campoAux = "";
              var messagemAux = "";
                                          
                for (var erro in erroList) {                    

                    if(erro == 'field')
                      campoAux = erroList['field'];

                    if(erro == 'message')
                      messagemAux = erroList['message'];                  
                                                                              
                }                                
                
                 messagemErroCampo = "Campo: [" + campoAux+ "] " + " - " + " Erro: " + messagemAux;
                 
                 $scope.messagesResult.push({ type: 'danger', msg: messagemErroCampo });                 
            }

        });   

     }                              
  };

  $scope.abrirContrato = function(){
                                    
            window.open("http://www.dceunifacs.com", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=600, height=600");     
  };

}]);


crudApp.controller('UploadFotoController', ['$scope', '$http', '$timeout', '$upload', function($scope, $http, $timeout, $upload){

// ALERTS (Array and Actions) $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  
  $scope.alerts = [
    //{ type: 'success', msg: '... ngs up and try submitting again.' },    
  ];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  

//var URL_BASE_SERVER_UPLOAD = 'http://localhost:9000/upload/foto/'; 
var URL_BASE_SERVER_UPLOAD = URL_REST_API_BASE +'upload/foto/'; 
var KEY_MULTIPARTI_FILE_UPLOAD_FOTO = 'fotoFile';
var HTTP_METHOD = 'POST';
var MSG_ERRO_TAMANHO_FOTO = 'Imagem tamanha máximo de 300KB'
var MSG_ERRO_TIPO_FOTO = ' é tipo não permitido p/ Foto.'
var MSG_FOTO_UPLOAD_SUCESSO = 'Foto - Carregada com sucesso.'

var uByte = 1;
var uKB = uByte * 1024;
//var uMB = uKB * 1024;
var TAM_FOTO_ACCEPT = uKB * 300; //var TAM_FOTO_ACCEPT = uMB * 500;


//Multupart/form-data ou File binary
var howToSend = 1;

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  
  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

  $scope.hasUploader = function(index) {
    return $scope.upload[index] != null;
  };

  $scope.abort = function(index) {
    $scope.upload[index].abort(); 
    $scope.upload[index] = null;
  };

  $scope.remove = function(index){
    document.getElementById("fileFoto").value ='';  
    $scope.selectedFiles = [];
    $scope.progress = [];
    $scope.errorMsg = null;
    $scope.upload[index] = null;

    $scope.alerts.splice(index, 1);

  }

 // onFileSelect ###############################################################################  
  $scope.onFileSelect = function($files) {
    $scope.selectedFiles = [];
    $scope.progress = [];
    $scope.errorMsg = null;

    var fSize = $files[0].size;
    var fType = $files[0].type;

    var flagFileValido = true;
    var fTypeInvalido = '';
          
// VERIFICA FILE VELIDO %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     if(fSize > TAM_FOTO_ACCEPT){  
        flagFileValido = false;

        $scope.errorMsg = MSG_ERRO_TAMANHO_FOTO;
        $scope.alerts.push({ type: 'danger', msg: $scope.errorMsg }); 
        document.getElementById("fileFoto").value ='';          
      }

      $scope.tipoFotoAceito = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp']; 

      var flagExisteTipo = $.inArray(fType, $scope.tipoFotoAceito);

      if(flagExisteTipo == -1){

        flagFileValido = false;
        fTypeInvalido = fType; 
      }

      if(!flagFileValido && fTypeInvalido != ''){
          $scope.errorMsg = fType +  MSG_ERRO_TIPO_FOTO;
          $scope.alerts.push({ type: 'danger', msg: $scope.errorMsg }); 
          document.getElementById("fileFoto").value ='';     
      }

// FIM VERIFICA FILE VELIDO %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%      
    
    if(flagFileValido){

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

      $scope.codigoResult = [];

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
      }
    }

  };
  
// START ###############################################################################
  $scope.start = function(index) {
    $scope.progress[index] = 0;
    $scope.errorMsg = null;

    var urlUploadWithCPF = URL_BASE_SERVER_UPLOAD + $scope.solicitacao.estudante.cpf;
    
    if (howToSend == 1) {  
      $scope.upload[index] = $upload.upload({
        url: urlUploadWithCPF,
        method: HTTP_METHOD, //$scope.httpMethod,
        //headers: {'my-header': 'my-header-value'},
        data : {
          myModel : $scope.solicitacao.estudante.cpf
        },

        file: $scope.selectedFiles[index],
                                    
        fileFormDataName: KEY_MULTIPARTI_FILE_UPLOAD_FOTO
        
      });

      $scope.upload[index].then(function(response) {
        $timeout(function() {                  
          $scope.uploadResult.push(response.data.nomeFileFotoCache);
          $scope.codigoResult.push(response.status);
          
           //APRESENTADO RESPOSTA DO SERVIDOR(CAREGADO ou NAO com sucesso) 
          if($scope.codigoResult[0] == '200'){

              $scope.solicitacao.estudante.nomeArquivoFoto =  $scope.uploadResult[0];

              $scope.alerts.push({ type: 'success', msg: MSG_FOTO_UPLOAD_SUCESSO }); 
          }else{
              console.log('$scope.codigoResult: ' + $scope.codigoResult);
              console.log('$scope.uploadResult.erroMessage: ' + $scope.uploadResult.erroMessage);

              $scope.errorMsg = $scope.uploadResult.erroMessage;
              var msgErroResultAux =  $scope.codigoResult + ' - ' + $scope.errorMsg;
              $scope.alerts.push({ type: 'danger', msg: msgErroResultAux }); 
          }

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
              url: URL_BASE_SERVER_UPLOAD,
          headers: {'Content-Type': $scope.selectedFiles[index].type},
          data: e.target.result
            }).then(function(response) {
          $scope.uploadResult.push(response.data);
          $scope.codigoResult.push(response.status);
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

  //###############################################################################
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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//DocumentoUploadController %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

crudApp.controller('DocumentoUploadController', ['$scope', '$http', '$timeout', '$upload', function($scope, $http, $timeout, $upload){

// ALERTS (Array and Actions) $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  
  $scope.alerts = [
    //{ type: 'success', msg: '... ngs up and try submitting again.' },    
  ];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  

//var URL_BASE_SERVER_UPLOAD_DOCUMENTO = 'http://localhost:9000/upload/documento/'; 
var URL_BASE_SERVER_UPLOAD_DOCUMENTO =  URL_REST_API_BASE+'upload/documento/'; 
var KEY_MULTIPARTI_FILE_UPLOAD_DOCUMENTO = 'documentoFile';
var HTTP_METHOD = 'POST';
var MSG_ERRO_TAMANHO_DOCUMENTO = 'Documento tamanho máximo de 600KB';
var MSG_ERRO_TIPO_DOCUMENTO = ' é tipo não permitido p/ Documento.';
var MSG_DOCUMENTO_UPLOAD_SUCESSO = 'Documento - Carregado com sucesso.';

var uByte = 1;
var uKB = uByte * 1024;
//var uMB = uKB * 1024;
var TAM_DOCUMENTO_ACCEPT = uKB * 600;

//Multupart/form-data ou File binary
var howToSend = 1;

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  
  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

  $scope.hasUploader = function(index) {
    return $scope.upload[index] != null;
  };

  $scope.abort = function(index) {
    $scope.upload[index].abort(); 
    $scope.upload[index] = null;
  };

  $scope.remove = function(index){
    document.getElementById("fileDocumento").value ='';  
    $scope.selectedFiles = [];
    $scope.progress = [];
    $scope.errorMsg = null;
    $scope.upload[index] = null;

    $scope.alerts.splice(index, 1);

  }

 // onFileSelect ###############################################################################  
  $scope.onFileSelect = function($files) {
    $scope.selectedFiles = [];
    $scope.progress = [];
    $scope.errorMsg = null;
  
    var fSize = $files[0].size;
    var fType = $files[0].type;

    var flagFileValido = true;
    var fTypeInvalido = '';

// VERIFICA FILE VELIDO %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     if(fSize > TAM_DOCUMENTO_ACCEPT){  
        flagFileValido = false;

        $scope.errorMsg = MSG_ERRO_TAMANHO_DOCUMENTO;
        $scope.alerts.push({ type: 'danger', msg: $scope.errorMsg }); 
        document.getElementById("fileDocumento").value ='';          
      }

      $scope.tipoDocumentoAceito = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; 

      var flagExisteTipo = $.inArray(fType, $scope.tipoDocumentoAceito);

      if(flagExisteTipo == -1){

        flagFileValido = false;
        fTypeInvalido = fType; 
      }

      if(!flagFileValido && fTypeInvalido != ''){
          $scope.errorMsg = fType +  MSG_ERRO_TIPO_DOCUMENTO;
          $scope.alerts.push({ type: 'danger', msg: $scope.errorMsg }); 
          document.getElementById("fileDocumento").value ='';     
      }

// FIM VERIFICA FILE VELIDO %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%      
    
    if(flagFileValido){

      if ($scope.upload && $scope.upload.length > 0) {
        for (var i = 0; i < $scope.upload.length; i++) {
          if ($scope.upload[i] != null) {
            $scope.upload[i].abort();
          }
        }
      }

      $scope.upload = [];
      $scope.uploadDocumentoResult = [];
      $scope.selectedFiles = $files;
      $scope.dataUrls = [];

      $scope.codigoDocumentoResult = [];

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
      }
    }

  };
  
// START ###############################################################################
  $scope.start = function(index) {
    $scope.progress[index] = 0;
    $scope.errorMsg = null;

    var urlUploadWithCPF = URL_BASE_SERVER_UPLOAD_DOCUMENTO + $scope.solicitacao.estudante.cpf;
    
    if (howToSend == 1) {  
      $scope.upload[index] = $upload.upload({
        url: urlUploadWithCPF,
        method: HTTP_METHOD, //$scope.httpMethod,
        //headers: {'my-header': 'my-header-value'},
        data : {
          myModel : $scope.solicitacao.estudante.cpf
        },

        file: $scope.selectedFiles[index],
                                    
        fileFormDataName: KEY_MULTIPARTI_FILE_UPLOAD_DOCUMENTO 
        
      });

      $scope.upload[index].then(function(response) {
        $timeout(function() {
          $scope.uploadDocumentoResult.push(response.data.nomeFileDocumentoCache);
          $scope.codigoDocumentoResult.push(response.status);


           //APRESENTADO RESPOSTA DO SERVIDOR(CAREGADO ou NAO com sucesso) 
          if($scope.codigoDocumentoResult[0] == '200'){              
              $scope.solicitacao.estudante.nomeArquivoDocumento = $scope.uploadDocumentoResult[0]; 
              $scope.alerts.push({ type: 'success', msg: MSG_DOCUMENTO_UPLOAD_SUCESSO }); 
          }else{
              console.log('$scope.codigoDocumentoResult: ' + $scope.codigoDocumentoResult);
              console.log('$scope.uploadDocumentoResult.erroMessage: ' + $scope.uploadDocumentoResult.erroMessage);

              $scope.errorMsg = $scope.uploadDocumentoResult.erroMessage;
              var msgErroResultAux =  $scope.codigoDocumentoResult + ' - ' + $scope.errorMsg;
              $scope.alerts.push({ type: 'danger', msg: msgErroResultAux }); 
          }

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
              url: URL_BASE_SERVER_UPLOAD_DOCUMENTO,
          headers: {'Content-Type': $scope.selectedFiles[index].type},
          data: e.target.result
            }).then(function(response) {
          $scope.uploadDocumentoResult.push(response.data);
          $scope.codigoDocumentoResult.push(response.status);
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

  //###############################################################################
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



