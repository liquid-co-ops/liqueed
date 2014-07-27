var liqueedApp = angular.module('LiqueedApp', ['ngCookies', 'ngResource', 'ngRoute']);

liqueedApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      templateUrl: rootApplication('views/home/index.html'),
      controller: 'HomeCtrl'
    })
    .when('/person', {
      templateUrl: rootApplication('views/person/index.html'),
      controller: 'PersonListCtrl'
    })
    .when('/person/:id', {
      templateUrl: rootApplication('views/person/view.html'),
      controller: 'PersonDetailCtrl'
    })
    .when('/project', {
      templateUrl: rootApplication('views/project/index.html'),
      controller: 'ProjectListCtrl'
    })
    .when('/project/:id', {
      templateUrl: rootApplication('views/project/view.html'),
      controller: 'ProjectDetailCtrl'
    })
    .when('/project/:id/period/:periodId', {
      templateUrl: rootApplication('views/period/view.html'),
      controller: 'PeriodDetailCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);

function rootApplication(path){
  return '/scripts/application/' + path
}
