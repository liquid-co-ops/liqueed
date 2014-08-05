liqueedApp.service('ProjectService', ['$resource',
  function($resource){
    return $resource('/api/project/:id', {id: '@id'});
  }
]);

liqueedApp.service('ProjectTeamService', ['$resource',
  function($resource){
    return $resource('/api/project/:id/team', {id: '@id'});
  }
]);

liqueedApp.service('ProjectPeriodService', ['$resource',
  function($resource){
    return $resource('/api/project/:id/period/:periodId', {id: '@id', periodId: '@periodId'});
  }
]);

liqueedApp.service('ProjectPeriodAssignmentService', ['$resource',
  function($resource){
    return $resource('/api/project/:id/period/:periodId/assignment', {id: '@id', periodId: '@periodId'});
  }
]);
