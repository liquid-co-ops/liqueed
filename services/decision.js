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

function getDecisionsByDescription(description, cb) {
    var store = db.store('decisions');
    store.find({ description: description }, cb);
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

function getDecisionResults(id, cb) {
    getDecisionVotes(id, function (err, votes) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var result = { "1": 0, "0": 0, "-1": 0 };
        
        votes.forEach(function (vote) {
            result[vote.value]++;
        });
        
        cb(null, result);
    });
}

function removeDecisionVote(id, userid, cb) {
    var vstore = db.store('votes');    
    vstore.find({ decision: id, user: userid }, function (err, votes) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var l = votes.length;
        var k = 0;
        
        removeVote();
        
        function removeVote() {
            if (k >= l) {
                cb(null, null);
                return;
            }
            
            var vote = votes[k++];
            
            vstore.remove(vote.id, function (err, data) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                setTimeout(removeVote, 0);
            });
        }
    });
}

function addDecisionVote(id, userid, value, cb) {
    removeDecisionVote(id, userid, function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var vstore = db.store('votes');
        vstore.add({ decision: id, user: userid, value: value }, cb);
    });
}

module.exports = {
    addDecision: addDecision,
    getDecisionById: getDecisionById,
    getDecisionsByDescription: getDecisionsByDescription,
    getDecisions: getDecisions,
    getDecisionsByProject: getDecisionsByProject,
    getDecisionsByCategory: getDecisionsByCategory,
    getDecisionVotes: getDecisionVotes,
    addDecisionVote: addDecisionVote,
    getDecisionResults: getDecisionResults
};

