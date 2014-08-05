'use strict';

describe('PersonListCtrl', function(){
    var PersonListCtrl,
    scope,
    PersonService,
    $httpBackend,

    expectedPersons = [
        {id: 1, name: 'Alice'},
        {id: 2, name: 'Bob'}
    ];

    beforeEach(function() {
        module('LiqueedApp');
    });

    beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _PersonService_) {
        scope = $rootScope.$new();
        PersonService = _PersonService_;
        $httpBackend = _$httpBackend_;
        PersonListCtrl = $controller('PersonListCtrl', {
            $scope: scope,
            PersonService: PersonService
        });
        $httpBackend.whenGET('/api/person').respond(200, expectedPersons);
    }));

    describe('persons', function(){
        it('should be attached to the scope', function(){
            expect(scope.persons).toBeDefined();
            expect(angular.isArray(scope.persons)).toBe(true);
            expect(scope.persons.length).toBe(0);
        });
        it('should hit the persons endpoint and bring back data', function(){
            scope.$apply();
            $httpBackend.flush();
            expect(angular.equals(scope.persons, expectedPersons)).toBe(true);
        });
    });
});