'use strict';

var db = require('../utils/db');

var store = db.store('persons');

function clear() {
    db.clear();
}

function addPerson(data) {
    return store.add(data);
}

function getPersonById(id) {
    return store.get(id);
}

function getPersons() {
    return store.find();
}

module.exports = {
    addPerson: addPerson,
    getPersonById: getPersonById,
    getPersons: getPersons,
    clear: clear
};

