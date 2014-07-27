liqueedApp.factory('PersonService', ['$resource',
  function($resource){
    return $resource('/api/person/:id', {id: '@id'});
  }
]);

liqueedApp.factory('PersonProjectService', ['$resource',
  function($resource){
    return $resource('/api/person/:id/project', {id: '@id'});
  }
]);