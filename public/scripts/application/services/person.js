liqueedApp.service('PersonService', ['$resource',
  function($resource){
    return $resource('/api/person/:id', {id: '@id'});
  }
]);

liqueedApp.service('PersonProjectService', ['$resource',
  function($resource){
    return $resource('/api/person/:id/project', {id: '@id'});
  }
]);