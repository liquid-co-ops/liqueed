'use strict';

var db = require('../utils/db');

var store;

db.store('decisions', function (err, data) {
    store = data;
});

function addDecision(data, cb) {
    var store = db.store('decisions');
        
    store.add(data, cb);
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

module.exports = {
    addDecision: addDecision,
    getDecisionById: getDecisionById,
    getDecisions: getDecisions,
    getDecisionsByProject: getDecisionsByProject,
    getDecisionsByCategory: getDecisionsByCategory
};

