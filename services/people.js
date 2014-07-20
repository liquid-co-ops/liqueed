
var ostore = require('ostore');

var store = ostore.createStore();

function addPerson(data) {
    return store.add(data);
}

function getPersonById(id) {
    return store.get(id);
}

module.exports = {
    addPerson: addPerson,
    getPersonById: getPersonById
}

