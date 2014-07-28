'use strict';

describe('NoteCtrl', function(){
    var NoteCtrl,
        scope,
        Notes,
        $httpBackend,
        expectedNotes = [
            {id: 1, text: 'Foo'},
            {id: 2, text: 'Bar'},
            {id: 3, text: 'Baz'}
        ];
    beforeEach(function() {
        module('LiqueedApp');
    });
    beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _Notes_) {
        scope = $rootScope.$new();
        Notes = _Notes_;
        $httpBackend = _$httpBackend_;
        NoteCtrl = $controller('NoteCtrl', {
            $scope: scope,
            Notes: Notes
        });
        $httpBackend.whenGET('/api/notes').respond(200, expectedNotes);
    }));
    describe('notes', function(){
        it('should be attached to the scope', function(){
            expect(scope.notes).toBeDefined();
            expect(angular.isArray(scope.notes)).toBe(true);
            expect(scope.notes.length).toBe(0);
        });
        it('should hit the notes endpoint and bring back data', function(){
            scope.$apply();
            $httpBackend.flush();
            expect(angular.equals(scope.notes, expectedNotes)).toBe(true);
        });
    });
});