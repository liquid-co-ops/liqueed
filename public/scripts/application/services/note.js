'use strict';

angular.module('LiqueedApp').
    service('Notes', function Notes($resource) {
        return $resource('/api/notes/:id', {id: '@id'});
    });