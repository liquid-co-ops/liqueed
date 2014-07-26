
var ostore = require('ostore');

var store = ostore.createStore();
var teamstore = ostore.createStore();
var periodstore = ostore.createStore();
var assignmentstore = ostore.createStore();

function addProject(data) {
    return store.add(data);
}

function getProjectById(id) {
    return store.get(id);
}

function addPersonToTeam(projid, personid) {
    return teamstore.add({ project: projid, person: personid });
}

function getTeam(id) {
    var teamdata = teamstore.find({ project: id });
    var team = [];
    var sperson = require('./person');
    
    teamdata.forEach(function (data) {
        var person = sperson.getPersonById(data.person);
        team.push(person);
    });
    
    return team;
}

function getProjects() {
    return store.find();
}

function addPeriod(projid, period) {
    period.project = projid;
    return periodstore.add(period);
}

function getPeriodById(periodid) {
    return periodstore.get(periodid);
}

function getPeriods(projid) {
    return periodstore.find({ project: projid });
}

function getAssignments(periodid) {
    var sperson = require('./person');    
    var data = assignmentstore.find({ period: periodid });
    
    var list = [];
    
    data.forEach(function (item) {
        var assignment = { id: item.id, amount: item.amount };
        assignment.from = sperson.getPersonById(item.from);
        assignment.to = sperson.getPersonById(item.to);
        list.push(assignment);
    });
    
    return list;
}

function addAssignment(periodid, fromid, toid, amount) {
    return assignmentstore.add({ period: periodid, from: fromid, to: toid, amount: amount });
}

function clear() {
    store = ostore.createStore();
    teamstore = ostore.createStore();
    periodstore = ostore.createStore();
    assignmentstore = ostore.createStore();
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById,
    getProjects: getProjects,
    
    addPersonToTeam: addPersonToTeam,
    getTeam: getTeam,
    
    addPeriod: addPeriod,
    getPeriodById: getPeriodById,
    getPeriods: getPeriods,
    
    getAssignments: getAssignments,
    addAssignment: addAssignment,
    
    clear: clear
}

