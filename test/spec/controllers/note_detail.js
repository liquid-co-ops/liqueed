'use strict';

describe('NoteDetailCtrl', function(){
    var NoteDetailCtrl,
        scope,
        Notes,
        $httpBackend,
        $routeParams,
        expectedNote = {id: 1, text: 'Foo'};
    beforeEach(function() {
        module('LiqueedApp');
    });
    beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _$routeParams_, _Notes_) {
        scope = $rootScope.$new();
        Notes = _Notes_;
        $httpBackend = _$httpBackend_;
        $routeParams = _$routeParams_;
        $routeParams.id = 1;
        NoteDetailCtrl = $controller('NoteDetailCtrl', {
            $scope: scope,
            $routeParams: $routeParams,
            Notes: Notes
        });
        $httpBackend.whenGET('/api/notes/'+$routeParams.id).respond(200, expectedNote);
    }));
    describe('note', function(){
        it('should be attached to the scope', function(){
            expect(scope.note).toBeDefined();
            expect(scope.note).toBe(null);
        });
        it('should hit the note endpoint and bring back data', function(){
            scope.$apply();
            $httpBackend.flush();
            expect(angular.equals(scope.note, expectedNote)).toBe(true);
        });
    });
});