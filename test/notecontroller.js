'use strict';

var controller = require('../controllers/note');

exports['get index'] = function(test) {
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
  var id = '1';
  var path;
  var request = {
    param: function() {
      return id;
    }
  };
  var response = {
    render: function(name, model) {
      test.ok(name);
      test.equal(name, 'notes/view');
      test.ok(model);
      test.equal(model.note, 'Note ' + id);
      test.ok(model.note);
      test.ok(Object.isObject(model.note));
      test.ok(model.note.text);
      test.fail(path);
      test.done();
    },
    redirect: function(p) {
      path = p;
    }
  };

  controller.get(request, response);
};