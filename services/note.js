'use strict';

var store = require('../utils/db').store('notes');

function addNote(data) {
  return store.add(data);
}

function getNoteById(id) {
  return store.get(id);
}

function getAllNotes() {
  return store.find();
}

function updateNoteById(id, data) {
  return store.update(id, data);
}

function removeNoteById(id) {
  return store.remove(id);
}

module.exports = {
  addNote:        addNote,
  getNoteById:    getNoteById,
  getAllNotes:    getAllNotes,
  updateNoteById: updateNoteById,
  removeNoteById: removeNoteById
};
