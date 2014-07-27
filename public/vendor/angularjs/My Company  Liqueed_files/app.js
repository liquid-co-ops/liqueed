var liqueedApp = angular.module('LiqueedApp', ['ngCookies', 'ngResource', 'ngRoute']);

var liqueedAppControllers = angular.module('liqueedAppControllers', []);

liqueedApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      templateUrl: rootApplication('views/home/index.html'),
      controller: 'HomeCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);

function rootApplication(path){
  return 'scripts/application/' + path
}
