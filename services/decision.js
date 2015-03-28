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

module.exports = {
    addDecision: addDecision,
    getDecisionById: getDecisionById
};

