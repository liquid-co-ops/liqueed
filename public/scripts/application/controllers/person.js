liqueedApp.controller('PersonListCtrl', ['$scope', 'PersonService',
  function($scope, PersonService) {

    $scope.persons = [];

    PersonService.query(function(data){
      $scope.persons = data;
    });

  }]
);

liqueedApp.controller('PersonDetailCtrl', ['$scope', '$routeParams', 'PersonService', 'PersonProjectService',
  function($scope, $routeParams, PersonService, PersonProjectService) {

    $scope.person = null;
    $scope.projects = [];

    PersonService.get({id: $routeParams.id}, function(data){
      $scope.person = data;
    });

    PersonProjectService.query({id: $routeParams.id}, function(data){
      $scope.projects = data
    });

  }]
);