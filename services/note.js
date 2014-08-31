'use strict';

var db = require('../utils/db');

function addNote(data, cb) {
    var store = db.store('notes');
    store.add(data, cb);
}

function getNoteById(id, cb) {
    var store = db.store('notes');
    store.get(id, cb);
}

function getAllNotes(cb) {
    var store = db.store('notes');
    store.find(cb);
}

function updateNoteById(id, data, cb) {
    var store = db.store('notes');
    store.update(id, data, cb);
}

function removeNoteById(id, cb) {
    var store = db.store('notes');
    store.remove(id, cb);
}

module.exports = {
  addNote:        addNote,
  getNoteById:    getNoteById,
  getAllNotes:    getAllNotes,
  updateNoteById: updateNoteById,
  removeNoteById: removeNoteById
};
