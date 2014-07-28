'use strict';

var controller = require('../controllers/noteapi');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');

var notes;

exports['clear and load data'] = function(test) {
    var noteService = require('../services/note');

    db.clear();
    loaddata();

    notes = noteService.getAllNotes();

    test.ok(notes);
    test.ok(Array.isArray(notes));
    test.ok(notes.length);
};

exports['get notes'] = function(test) {
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
