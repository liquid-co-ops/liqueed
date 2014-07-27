liqueedApp.factory('ProjectService', ['$resource',
  function($resource){
    return $resource('/api/project/:id', {id: '@id'});
  }
]);

liqueedApp.factory('ProjectTeamService', ['$resource',
  function($resource){
    return $resource('/api/project/:id/team', {id: '@id'});
  }
]);

liqueedApp.factory('ProjectPeriodService', ['$resource',
  function($resource){
    return $resource('/api/project/:id/period/:periodId', {id: '@id', periodId: '@periodId'});
  }
]);

liqueedApp.factory('ProjectPeriodAssignmentService', ['$resource',
  function($resource){
    return $resource('/api/project/:id/period/:periodId/assignment', {id: '@id', periodId: '@periodId'});
  }
]);
