'use strict';

var controller = require('../controllers/noteapi');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');

var notes;

exports['clear and load data'] = function(test) {
    test.async();
    
    var noteService = require('../services/note');

    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { noteService.getAllNotes(next); })
    .then(function (data, next) {
        notes = data;

        test.ok(notes);
        test.ok(Array.isArray(notes));
        test.ok(notes.length);
        test.done();
    })
    .run();
};

exports['get notes'] = function(test) {
    test.async();
    
    var request = {};
    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.ok(model[0].id);
            test.ok(model[0].text);
            test.done();
        }
    };

    controller.list(request, response);
};

exports['get first note'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: notes[0].id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.id, notes[0].id);
            test.equal(model.text, notes[0].text);
            test.done();
        }
    };

    controller.get(request, response);
};
