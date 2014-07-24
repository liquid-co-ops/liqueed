
var store = require('ostore').createStore();

function addNote(data) {
  return store.add(data);
}

function getNoteById(id) {
  return store.get(id);
}

module.exports = {
  addNote: addNote,
  getNoteById: getNoteById
};
