
var ostore = require('ostore');

var store = ostore.createStore();

function addProject(data) {
    return store.add(data);
}

function getProjectById(id) {
    return store.get(id);
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById
}

