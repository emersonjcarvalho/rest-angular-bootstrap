"use strict";

angular.module('fileUpload', [ 'angularFileUpload' ]);

//var uploadUrl = 'http://angular-file-upload-cors-srv.appspot.com/upload';

//var uploadUrl = 'http://localhost:9000/upload/'; 
var uploadUrl = 'http://localhost:9000/upload/foto/'; 

var KEY_MULTIPARTI_FILE_UPLOAD_FOTO = 'fotoFile';
var HTTP_METHOD = 'POST';

//Multupart/form-data ou File binary
var howToSend = 1;

//window.uploadUrl = window.uploadUrl || 'upload';
	
var MyCtrl = [ '$scope', '$http', '$timeout', '$upload', function($scope, $http, $timeout, $upload) {
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
//				xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
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
} ];
