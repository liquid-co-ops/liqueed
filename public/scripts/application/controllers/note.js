'use strict';

angular.module('LiqueedApp')
    .controller(
        'NoteCtrl',
        function($scope, Notes) {
            Notes.query(function(data) {$scope.notes = data});
        }
    );