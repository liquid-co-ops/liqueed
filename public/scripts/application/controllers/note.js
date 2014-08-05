'use strict';

angular.module('LiqueedApp')
    .controller(
        'NoteCtrl',
        function($scope, Notes) {
            $scope.notes = [];
            Notes.query(
                function(data) {
                    $scope.notes = data
                }
            );
        }
    ).controller(
        'NoteDetailCtrl',
        function($scope, $routeParams, Notes) {
            $scope.note = null;
            Notes.get(
                {
                    'id': $routeParams.id
                },
                function(data) {
                    $scope.note = data
                }
            );
        }
);