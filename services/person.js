
var db = require('../utils/db');

var store = db.store('persons');

function addPerson(data) {
    return store.add(data);
}

function getPersonById(id) {
    return store.get(id);
}

function getPersons() {
    return store.find();
}

function clear() {
    store = db.createStore('persons');
}

module.exports = {
    addPerson: addPerson,
    getPersonById: getPersonById,
    getPersons: getPersons,
    clear: clear
};

