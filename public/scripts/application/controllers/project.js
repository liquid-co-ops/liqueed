liqueedApp.controller('ProjectListCtrl', ['$scope', '$routeParams', 'ProjectService',
  function($scope, $routeParams, ProjectService) {

    ProjectService.query(function(data){
      $scope.projects = data;
    });

  }]
);

liqueedApp.controller('ProjectDetailCtrl', ['$scope', '$routeParams', 'ProjectService',
  'ProjectTeamService', 'ProjectPeriodService',
  function($scope, $routeParams, ProjectService, ProjectTeamService, ProjectPeriodService) {

    ProjectService.get({id: $routeParams.id}, function(data){
      $scope.project = data;
    });

    ProjectTeamService.query({id: $routeParams.id},function(data){
      $scope.teams = data;
    });

    ProjectPeriodService.query({id: $routeParams.id}, function(data){
      $scope.periods = data;
    });

  }]
);
