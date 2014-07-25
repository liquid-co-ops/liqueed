
var service = require('../services/note');

var noteid;
var expectedText = 'foo';
var note1 = {text: expectedText};
var note2 = {text: 'bar'};

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

  test.equal(result.length, 2);

  delete result[0]['id'];
  delete result[1]['id'];

  test.deepEqual(result[0], note1);
  test.deepEqual(result[1], note2);
};

exports['remove note by id'] = function(test) {
  service.removeNoteById(noteid);
  test.equal(service.getNoteById(noteid), null);
};
