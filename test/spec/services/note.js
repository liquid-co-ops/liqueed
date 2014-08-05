'use strict';

describe('Service Note', function(){
    var Notes,
        $httpBackend;
    beforeEach(function() {module('LiqueedApp')});
    beforeEach(inject(function(_Notes_, _$httpBackend_) {
        Notes = _Notes_;
        $httpBackend = _$httpBackend_;
    }));

    describe('resource methods', function(){
        it('should get a collection of notes from /api/notes', function(){
            $httpBackend.whenGET('/api/notes')
                .respond(function(method, url, data) {
                    expect(url).toBe('/api/notes');
                    expect(method).toBe('GET');
                    expect(data).toBeUndefined();
                    return [200, [], {}];
                });
            Notes.query();
            $httpBackend.flush();
        });
        it('should get a note from /api/notes/:id', function(){
            var noteId = 1;
            $httpBackend.whenGET('/api/notes/'+noteId)
                .respond(function(method, url, data) {
                    expect(url).toBe('/api/notes/'+noteId);
                    expect(method).toBe('GET');
                    return [200, {id: noteId, text: 'Foo'}, {}];
                });
            Notes.get({'id': noteId});
            $httpBackend.flush();
        });

        it('should create a note from /api/notes', function(){
            var note = {text: 'Bar'};

            $httpBackend.whenPOST('/api/notes')
                .respond(function(method, url, data) {
                    var parsedData = JSON.parse(data);
                    expect(url).toBe('/api/notes');
                    expect(method).toBe('POST');
                    expect(angular.equals(note, parsedData)).toBe(true);
                    return [200, {id: 2, text: 'Bar'}, {}];
                });
            Notes.save(note);
            $httpBackend.flush();
        });
        it('should update a note from /api/notes/:id', function(){
            var noteId = 2;
            $httpBackend.whenPOST('/api/notes/'+noteId)
                .respond(function(method, url, data) {
                    expect(url).toBe('/api/notes/'+noteId);
                    expect(method).toBe('POST');
                    return [200, {id: noteId, text: 'Bar'}, {}];
                });
            Notes.save({'id': noteId, text: 'Bar'});
            $httpBackend.flush();
        });
        it('should delete a note from /api/notes/:id', function(){
            var noteId = 2;
            $httpBackend.whenDELETE('/api/notes/'+noteId)
                .respond(function(method, url, data) {
                    expect(url).toBe('/api/notes/'+noteId);
                    expect(method).toBe('DELETE');
                    return [200, null, {}];
                });
            Notes.remove({'id': noteId});
            $httpBackend.flush();
        });

    });




});