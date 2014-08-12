'use strict';

/* Filters */

angular.module('crudApp.filters', [])
.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

/**
.filter('toYear', function () {
     return function (dateString) {
         var dateObject = new Date(dateString);
         return dateObject.getFullYear();
     };
});
**/
  
