'use strict';

var db = require('../utils/db');
var store;

db.store('notes', function (err, data) {
    store = data;
});

function addNote(data, cb) {
  store.add(data, cb);
}

function getNoteById(id, cb) {
  store.get(id, cb);
}

function getAllNotes(cb) {
  store.find(cb);
}

function updateNoteById(id, data, cb) {
  store.update(id, data, cb);
}

function removeNoteById(id, cb) {
  store.remove(id, cb);
}

module.exports = {
  addNote:        addNote,
  getNoteById:    getNoteById,
  getAllNotes:    getAllNotes,
  updateNoteById: updateNoteById,
  removeNoteById: removeNoteById
};
