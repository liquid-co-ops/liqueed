'use strict';

var db = require('../utils/db');

var store = db.store('projects');
var teamstore = db.store('teams');
var periodstore = db.store('periods');
var assignmentstore = db.store('assignments');

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

function getShareholders(id) {
    return getTeam(id);
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

function putAssignment(projectid, periodid, fromid, toid, amount) {
    var period = getPeriodById(periodid);
    var total = getTotalAssignments(projectid, periodid, fromid);
    
    var items = assignmentstore.find({ projectid: projectid, period: periodid, from: fromid, to: toid });
    
    var olditem = (items && items.length) ? items[0] : null;
    var oldamount = olditem ? olditem.amount : 0;
        
    var newtotal = total - oldamount + amount;
    
    if (newtotal > period.amount)
        return { error: 'You assigned too many shares' };

    if (olditem) {
        olditem.amount = amount;
        assignmentstore.put(olditem.id, olditem);
        return olditem.id;
    }
    else
        return assignmentstore.add({ projectid: projectid, period: periodid, from: fromid, to: toid, amount: amount });
}

function getTotalAssignments(projectid, periodid, fromid) {
    var items = assignmentstore.find({ projectid: projectid, period: periodid, from: fromid });
    
    var total = 0;
    
    items.forEach(function (item) {
        total += item.amount;
    });
    
    return total;
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById,
    getProjects: getProjects,
    
    addPersonToTeam: addPersonToTeam,
    getTeam: getTeam,
    
    getShareholders: getShareholders,
    
    addPeriod: addPeriod,
    getPeriodById: getPeriodById,
    getPeriods: getPeriods,
    
    getAssignments: getAssignments,
    putAssignment: putAssignment,
    getTotalAssignments: getTotalAssignments
}

