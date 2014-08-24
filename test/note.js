'use strict';

var service = require('../services/note');
var db = require('../utils/db');
var async = require('simpleasync');

var noteid;
var expectedText = 'Foo';
var note1 = {text: expectedText};
var note2 = {text: 'Bar'};

exports['clear data'] = function(test) {
  test.async();
  
  async()
  .then(function (data, next) { db.clear(next); })
  .then(function (data, next) { service.getAllNotes(next); })
  .then(function (result, next) {
      test.ok(result);
      test.equal(result.length, 0);
      test.done();
  })
  .run();
};

exports['add note'] = function(test) {
  test.async();
  
  service.addNote(note1, function (err, result) {
    test.ok(!err);
    test.ok(result);
    noteid = result;
    test.done();
  });
};

exports['get note by id'] = function(test) {
  service.getNoteById(noteid, function (err, result) {
      test.ok(!err);
      test.ok(result);
      test.equal(result.text, expectedText);
      test.equal(result.id, noteid);
      test.done();
  });
};

exports['get all notes']  = function(test) {
  test.async();
  
  async()
  .then(function (data, next) { service.addNote(note2, next); })
  .then(function (data, next) { service.getAllNotes(next); })
  .then(function (result, next) {
    test.ok(result);

    test.equal(result.length, 2);

    delete result[0].id;
    delete result[1].id;

    test.deepEqual(result[0], note1);
    test.deepEqual(result[1], note2);
    
    test.done();
  })
  .run();
};

exports['update a note by id'] = function(test) {
  test.async();
  var id;
  
  async()
  .then(function (data, next) { service.getAllNotes(next); })
  .then(function (data, next) {
    var note = data[1];
    id = note.id;
    
    note.text = expectedText;
    service.updateNoteById(id, note, next);
  })
  .then(function (data, next) {
    service.getNoteById(id, next);
  })
  .then(function (result, next) {
    test.ok(result);
    test.equal(id, result.id);
    test.equal(result.text, expectedText);
    test.done();
  })
  .run();
};

exports['remove note by id'] = function(test) {
  test.async();
  
  async()
  .then(function (data, next) { service.removeNoteById(noteid, next); })
  .then(function (data, next) { service.getNoteById(noteid, next); })
  .then(function (result, next) {
    test.equal(result, null);
    test.done();
  })
  .run();
};

