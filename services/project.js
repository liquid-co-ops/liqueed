
var ostore = require('ostore');

var store = ostore.createStore();
var peoplestore = ostore.createStore();
var periodstore = ostore.createStore();

function addProject(data) {
    return store.add(data);
}

function getProjectById(id) {
    return store.get(id);
}

function addPersonToTeam(projid, personid) {
    return peoplestore.add({ project: projid, person: personid });
}

function getTeam(id) {
    return peoplestore.find({ project: id });
}

function getProjects() {
    return store.find();
}

function addPeriod(projid, period) {
    period.project = projid;
    return periodstore.add(period);
}

function getPeriod(periodid) {
    return periodstore.get(periodid);
}

function getPeriods(projid) {
    return periodstore.find({ project: projid });
}

function getAssignments(periodid) {
    return [];
}

function clear() {
    store = ostore.createStore();
    peoplestore = ostore.createStore();
    periodstore = ostore.createStore();
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById,
    getProjects: getProjects,
    
    addPersonToTeam: addPersonToTeam,
    getTeam: getTeam,
    
    addPeriod: addPeriod,
    getPeriod: getPeriod,
    getPeriods: getPeriods,
    
    getAssignments: getAssignments,
    
    clear: clear
}

