'use strict';

var service = require('../services/note');

var noteid;
var expectedText = 'Foo';
var note1 = {text: expectedText};
var note2 = {text: 'Bar'};

exports['add note'] = function(test) {
  var result = service.addNote(note1);

  test.ok(result);
  noteid = result;
};

exports['get note by id'] = function(test) {
  var result = service.getNoteById(noteid);

  test.ok(result);
  test.equal(result.text, expectedText);
  test.equal(result.id, noteid);
};

exports['get all notes']  = function(test) {
  service.addNote(note2);
  var result = service.getAllNotes();

  test.ok(result);

  test.equal(result.length, 5);

  delete result[0].id;
  delete result[1].id;

  test.deepEqual(result[0], note1);
  test.deepEqual(result[1], note2);
};

exports['update a note by id'] = function(test) {
  var note = service.getAllNotes()[1];
  var id = note.id;

  note.text = expectedText;
  service.updateNoteById(id, note);
  var result = service.getNoteById(id);

  test.ok(result);
  test.equal(id, result.id);
  test.equal(result.text, expectedText);
};

exports['remove note by id'] = function(test) {
  service.removeNoteById(noteid);
  test.equal(service.getNoteById(noteid), null);
};

