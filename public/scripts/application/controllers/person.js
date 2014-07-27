liqueedApp.controller('PersonListCtrl', ['$scope', '$routeParams', 'PersonService',
  function($scope, $routeParams, PersonService) {

    PersonService.query(function(data){
      $scope.persons = data;
    });

  }]
);

liqueedApp.controller('PersonDetailCtrl', ['$scope', '$routeParams', 'PersonService', 'PersonProjectService',
  function($scope, $routeParams, PersonService, PersonProjectService) {

    PersonService.get({id: $routeParams.id}, function(data){
      $scope.person = data;
    });

    PersonProjectService.query({id: $routeParams.id}, function(data){
      $scope.projects = data
    });

  }]
);