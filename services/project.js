
var ostore = require('ostore');

var store = ostore.createStore();
var peoplestore = ostore.createStore();

function addProject(data) {
    return store.add(data);
}

function getProjectById(id) {
    return store.get(id);
}

function addPersonToProject(projid, personid) {
    return peoplestore.add({ project: projid, person: personid });
}

function getProjectTeam(id) {
    return peoplestore.find({ project: id });
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById,
    addPersonToProject: addPersonToProject,
    getProjectTeam: getProjectTeam
}

