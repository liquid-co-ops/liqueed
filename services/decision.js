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

module.exports = {
    addDecision: addDecision
};

