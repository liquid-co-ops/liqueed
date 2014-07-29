'use strict';

describe('Service Person', function(){
  var PersonService,
      $httpBackend;
  beforeEach(function() {module('LiqueedApp')});
  beforeEach(inject(function(_PersonService_, _$httpBackend_) {
      PersonService = _PersonService_;
      $httpBackend = _$httpBackend_;
  }));

  describe('resource methods', function(){

    it('should get a collection of person from /api/person', function(){
        $httpBackend.whenGET('/api/person')
            .respond(function(method, url, data) {
                expect(url).toBe('/api/person');
                expect(method).toBe('GET');
                expect(data).toBeUndefined();
                return [200, [], {}];
            });
        PersonService.query();
        $httpBackend.flush();
    });

    it('should get a person from /api/person/:id', function(){
        var personId = 1;
        $httpBackend.whenGET('/api/person/' + personId)
            .respond(function(method, url, data) {
                expect(url).toBe('/api/person/' + personId);
                expect(method).toBe('GET');
                return [200, {id: personId, name: 'Alice'}, {}];
            });
        PersonService.get({'id': personId});
        $httpBackend.flush();
    });

  });


});

describe('Service Person Project', function(){
  var PersonProjectService,
      $httpBackend;
  beforeEach(function() {module('LiqueedApp')});
  beforeEach(inject(function(_PersonProjectService_, _$httpBackend_) {
      PersonProjectService = _PersonProjectService_;
      $httpBackend = _$httpBackend_;
  }));

  describe('resource methods', function(){

    it('should obtain a collection of projects for person from /api/person/:id/project', function(){
      var personId = 1;
      $httpBackend.whenGET('/api/person/' + personId + '/project')
          .respond(function(method, url, data) {
              expect(url).toBe('/api/person/' + personId + '/project');
              expect(method).toBe('GET');
              expect(data).toBeUndefined();
              return [200, [], {}];
          });
      PersonProjectService.query({'id': personId});
      $httpBackend.flush();
    });

  });


});