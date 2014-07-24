
var service = require('../services/notes');

var noteid;
var expectedText = 'foo';

exports['add note'] = function(test) {
  var result = service.addNote({text: expectedText});

  test.ok(result);
  noteid = result;
};

exports['get note by id'] = function(test) {
  var result = service.getNoteById(noteid);

  test.ok(result);
  test.equal(result.text, expectedText);
  test.equal(result.id, noteid);
};
