'use strict';

var controller = require('../controllers/note');

var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');

exports['clear and load data'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { test.done(); })
    .run();
};

exports['get index'] = function(test) {
    test.async();
    
    var request = {};
    var response = {
        render: function(name, model) {
            test.ok(name);
            test.equal(name, 'notes/list');
            test.ok(model);
            test.equal(model.title, 'Notes');
            test.ok(model.notes);
            test.ok(Array.isArray(model.notes));
            test.ok(model.notes.length);
            test.ok(model.notes[0].id);
            test.ok(model.notes[0].text);
            test.done();
        }
    };

    controller.index(request, response);
};

exports['get a note'] = function(test) {
    test.async();
    
    var id = '1';
    var path;
    var request = {
        param: function() {
            return id;
        }
    };
    var response = {
        render:   function(name, model) {
            test.ok(name);
            test.equal(name, 'notes/view');
            test.ok(model);
            test.equal(model.title, 'Note ' + id);
            test.ok(model.note);
            test.ok(Object.prototype.toString.call(model.note) === '[object Object]');
            test.ok(model.note.text);
            test.equal(path, undefined);
            test.done();
        },
        redirect: function(p) {
            path = p;
        }
    };

    controller.get(request, response);
};

exports['get a note fails'] = function(test) {
    test.async();
    
    var path;
    var request = {
        param: function() {
            return false;
        }
    };
    var response = {
        redirect: function(p) {
            path = p;
            test.ok(path);
            test.done();
        }
    };
    controller.get(request, response);
};

exports['create a note'] = function(test) {
    test.async();
    
    var expectedPath = '/notes/4';
    var request = {
        param: function(p) {
            return 'foo';
        }
    };
    var response = {
        redirect: function(p) {
            test.ok(p);
            test.equal(p, expectedPath);
            test.done();
        }
    };
    controller.create(request, response);
};

exports['edit a note'] = function(test) {
    test.async();
    
    var id = '3';
    var expectedPath = '/notes/' + id;
    var request = {
        param: function(p) {
            return p === 'id' ? id : 'bar';
        }
    };
    var response = {
        redirect: function(p) {
            test.ok(p);
            test.equal(p, expectedPath);
            test.done();
        }
    };
    controller.put(request, response);
};

exports['delete a note'] = function(test) {
    test.async();
    
    var expectedPath = '/notes';
    var request = {
        param: function(p) {
            return '3';
        }
    };
    var response = {
        redirect: function(p) {
            test.ok(p);
            test.equal(p, expectedPath);
            test.done();
        }
    };
    controller.remove(request, response);
};


