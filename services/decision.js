'use strict';

var db = require('../utils/db');

var store;
var vstore;

db.store('decisions', function (err, data) {
    store = data;
});

db.store('votes', function (err, data) {
    vstore = data;
});

function addDecision(projid, data, cb) {
    var newdata = { };
    
    for (var n in data)
        newdata[n] = data[n];
        
    newdata.project = projid;
    
    var store = db.store('decisions');
        
    store.add(newdata, cb);
}

function getDecisionById(id, cb) {
    var store = db.store('decisions');
    store.get(id, cb);
}

function getDecisionsByProject(projectid, cb) {
    var store = db.store('decisions');
    store.find({ project: projectid }, cb);
}

function getDecisionsByCategory(categoryid, cb) {
    var store = db.store('decisions');
    store.find({ category: categoryid }, cb);
}

function getDecisions(cb) {
    var store = db.store('decisions');
    store.find(cb);
}

function getDecisionVotes(id, cb) {
    var vstore = db.store('votes');    
    vstore.find({ decision: id }, cb);
}

function addDecisionVote(id, userid, value, cb) {
    var vstore = db.store('votes');
    vstore.add({ decision: id, user: userid, value: value }, cb);
}

module.exports = {
    addDecision: addDecision,
    getDecisionById: getDecisionById,
    getDecisions: getDecisions,
    getDecisionsByProject: getDecisionsByProject,
    getDecisionsByCategory: getDecisionsByCategory,
    getDecisionVotes: getDecisionVotes,
    addDecisionVote: addDecisionVote
};

