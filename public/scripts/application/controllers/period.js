liqueedApp.controller('PeriodDetailCtrl', ['$scope', '$routeParams', 'ProjectService',
  'ProjectPeriodService', 'ProjectPeriodAssignmentService',
  function($scope, $routeParams, ProjectService, ProjectPeriodService, ProjectPeriodAssignmentService) {

    ProjectService.get({id: $routeParams.id}, function(data){
      $scope.project = data;
    });

    ProjectPeriodService.get({id: $routeParams.id, periodId: $routeParams.periodId}, function(data){
      $scope.period = data;
    });

    ProjectPeriodAssignmentService.query({id: $routeParams.id, periodId: $routeParams.periodId}, function(data){
       $scope.assignments = data;
    })
  }]
);

