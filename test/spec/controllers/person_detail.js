'use strict';

describe('PersonDetailCtrl', function(){
    var PersonDetailCtrl,
        scope,
        PersonService,
        PersonProjectService,
        $httpBackend,
        $routeParams,
        expectedPerson = {id: 1, name: 'Alice'},
        expectedProjects = {id: 1, name: 'FaceHub'};

    beforeEach(function() {
        module('LiqueedApp');
    });

    beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _$routeParams_, _PersonService_, _PersonProjectService_) {
        scope = $rootScope.$new();
        PersonService = _PersonService_;
        PersonProjectService = _PersonProjectService_;
        $httpBackend = _$httpBackend_;
        $routeParams = _$routeParams_;
        $routeParams.id = 1;
        PersonDetailCtrl = $controller('PersonDetailCtrl', {
            $scope: scope,
            $routeParams: $routeParams,
            PersonService: PersonService,
            PersonProjectService: PersonProjectService
        });

        $httpBackend.whenGET('/api/person/' + $routeParams.id).respond(200, expectedPerson);
        $httpBackend.whenGET('/api/person/' + $routeParams.id + '/project').respond(200, expectedProjects);
    }));

    describe('person', function(){
        it('should be attached to the scope', function(){
            expect(scope.person).toBeDefined();
            expect(scope.person).toBe(null);
        });
    });


    describe('projects', function(){
        it('should be attached to the scope', function(){
            expect(scope.projects).toBeDefined();
            expect(angular.isArray(scope.projects)).toBe(true);
            expect(scope.projects.length).toBe(0);
        });
    });
});