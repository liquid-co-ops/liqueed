'use strict';

describe('Service Project', function(){
  var ProjectService,
      $httpBackend;
  beforeEach(function() {module('LiqueedApp')});
  beforeEach(inject(function(_ProjectService_, _$httpBackend_) {
      ProjectService = _ProjectService_;
      $httpBackend = _$httpBackend_;
  }));

  describe('resource methods', function(){

    it('should get a collection of project from /api/project', function(){
        $httpBackend.whenGET('/api/project')
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project');
                expect(method).toBe('GET');
                expect(data).toBeUndefined();
                return [200, [], {}];
            });
        ProjectService.query();
        $httpBackend.flush();
    });

    it('should get a project from /api/project/:id', function(){
        var projectId = 1;
        $httpBackend.whenGET('/api/project/' + projectId)
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project/' + projectId);
                expect(method).toBe('GET');
                return [200, {id: projectId, name: 'FaceHub'}, {}];
            });
        ProjectService.get({'id': projectId});
        $httpBackend.flush();
    });

  });


});


describe('Service Project Team', function(){
  var ProjectTeamService,
      $httpBackend;
  beforeEach(function() {module('LiqueedApp')});
  beforeEach(inject(function(_ProjectTeamService_, _$httpBackend_) {
      ProjectTeamService = _ProjectTeamService_;
      $httpBackend = _$httpBackend_;
  }));

  describe('resource methods', function(){

    it('should get a collection of team for project from /api/project/:id/team', function(){
        var projectId = 1;
        $httpBackend.whenGET('/api/project/' + projectId + '/team')
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project/' + projectId + '/team');
                expect(method).toBe('GET');
                return [200, [], {}];
            });
        ProjectTeamService.query({'id': projectId});
        $httpBackend.flush();
    });

  });

});

describe('Service Project Period', function(){
  var ProjectPeriodService,
      $httpBackend;
  beforeEach(function() {module('LiqueedApp')});
  beforeEach(inject(function(_ProjectPeriodService_, _$httpBackend_) {
      ProjectPeriodService = _ProjectPeriodService_;
      $httpBackend = _$httpBackend_;
  }));

  describe('resource methods', function(){

    it('should get a collection of periods for project from /api/project/:id/period', function(){
        var projectId = 1;
        $httpBackend.whenGET('/api/project/' + projectId + '/period')
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project/' + projectId + '/period');
                expect(method).toBe('GET');
                return [200, [], {}];
            });
        ProjectPeriodService.query({'id': projectId});
        $httpBackend.flush();
    });

    it('should get a period for project from /api/project/:id/period/:periodId', function(){
        var projectId = 1,
            periodId  = 1;

        $httpBackend.whenGET('/api/project/' + projectId + '/period/' + periodId)
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project/' + projectId + '/period/' + periodId);
                expect(method).toBe('GET');
                return [200, {id: periodId, name: "March 2014", date: "2014-03-31", amount: 400 }, {}];
            });
        ProjectPeriodService.get({'id': projectId, 'periodId': periodId});
        $httpBackend.flush();
    });

  });

});

describe('Service Project Period', function(){
  var ProjectPeriodService,
      $httpBackend;
  beforeEach(function() {module('LiqueedApp')});
  beforeEach(inject(function(_ProjectPeriodService_, _$httpBackend_) {
      ProjectPeriodService = _ProjectPeriodService_;
      $httpBackend = _$httpBackend_;
  }));

  describe('resource methods', function(){

    it('should get a collection of periods for project from /api/project/:id/period', function(){
        var projectId = 1;
        $httpBackend.whenGET('/api/project/' + projectId + '/period')
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project/' + projectId + '/period');
                expect(method).toBe('GET');
                return [200, [], {}];
            });
        ProjectPeriodService.query({'id': projectId});
        $httpBackend.flush();
    });

    it('should get a period for project from /api/project/:id/period/:periodId', function(){
        var projectId = 1,
            periodId  = 1;

        $httpBackend.whenGET('/api/project/' + projectId + '/period/' + periodId)
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project/' + projectId + '/period/' + periodId);
                expect(method).toBe('GET');
                return [200, {id: periodId, name: "March 2014", date: "2014-03-31", amount: 400 }, {}];
            });
        ProjectPeriodService.get({'id': projectId, 'periodId': periodId});
        $httpBackend.flush();
    });

  });

});

describe('Service Project Period Assignment', function(){
  var ProjectPeriodAssignmentService,
      $httpBackend;
  beforeEach(function() {module('LiqueedApp')});
  beforeEach(inject(function(_ProjectPeriodAssignmentService_, _$httpBackend_) {
      ProjectPeriodAssignmentService = _ProjectPeriodAssignmentService_;
      $httpBackend = _$httpBackend_;
  }));

  describe('resource methods', function(){

    it('should get a collection of assignment for period to a project from /api/project/:id/period/:periodId/assignment', function(){
        var projectId = 1,
            periodId  = 1;
        $httpBackend.whenGET('/api/project/' + projectId + '/period/' + periodId + '/assignment')
            .respond(function(method, url, data) {
                expect(url).toBe('/api/project/' + projectId + '/period/' + periodId + '/assignment');
                expect(method).toBe('GET');
                return [200, [], {}];
            });
        ProjectPeriodAssignmentService.query({'id': projectId, 'periodId': periodId});
        $httpBackend.flush();
    });

  });

})




