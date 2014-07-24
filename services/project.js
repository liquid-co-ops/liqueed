
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

function getProjects() {
    return store.find();
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById,
    getProjects: getProjects,
    addPersonToProject: addPersonToProject,
    getProjectTeam: getProjectTeam
}

