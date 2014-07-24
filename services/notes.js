var store = require('ostore').createStore();

function addNote(data) {
  return store.add(data);
}

function getNoteById(id) {
  return store.get(id);
}

function getAllNotes() {
  return store.find({});
}

function removeNoteById(id) {
  return store.remove(id);
}

module.exports = {
  addNote:        addNote,
  getNoteById:    getNoteById,
  getAllNotes:    getAllNotes,
  removeNoteById: removeNoteById
};
