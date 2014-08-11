'use strict';

/* Directives */


var crudApp =  angular.module('crudApp.directives', []);
        
        
  crudApp.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
  
  
  crudApp.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {
            ngModel.$render = function () {
                ngModel.$setViewValue(el.val());
            };

            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
        }
    };
});

