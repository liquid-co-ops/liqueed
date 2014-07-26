
var ostore = require('ostore');

var store = ostore.createStore();

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
    store = ostore.createStore();
}

module.exports = {
    addPerson: addPerson,
    getPersonById: getPersonById,
    getPersons: getPersons,
    clear: clear
};

