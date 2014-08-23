'use strict';

var db = require('../utils/db');

var store;

db.store('projects', function (err, data) {
    store = data;
});

var teamstore;

db.store('teams', function (err, data) {
    teamstore = data;
});

var periodstore;

db.store('periods', function (err, data) {
    periodstore = data;
});

var assignmentstore;

db.store('assignments', function (err, data) {
    assignmentstore = data;
});

var personstore;

db.store('persons', function (err, data) {
    personstore = data;
});

var sl = require('simplelists');

function addProject(data, cb) {
    store.add(data, cb);
}

function getProjectById(id, cb) {
    store.get(id, cb);
}

function addPersonToTeam(projid, personid, cb) {
    teamstore.add({ project: projid, person: personid }, cb);
}

function getTeam(id, cb) {
    teamstore.find({ project: id }, function (err, teamdata) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var team = [];
        var sperson = require('./person');

        var l = teamdata.length;
        var k = 0;
        
        doTeamStep();
        
        function doTeamStep() {
            if (k >= l) {
                cb(null, team);
                return;
            }
            
            var data = teamdata[k++];
            
            sperson.getPersonById(data.person, function (err, person) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                team.push(person);
                
                setImmediate(doTeamStep);
            });
        }
    });
}

function getShareholders(id) {
    var teamdata = teamstore.find({ project: id });
    var sharedata = assignmentstore.find({ project: id });

    var ids = sl.project(teamdata, { person: 'id' });
    ids = sl.union(ids, sl.project(sharedata, { to: 'id' }), 'id');
    ids = sl.union(ids, sl.project(sharedata, { from: 'id' }), 'id');
    
    var shareholders = [];

    ids.forEach(function (data) {
        var person = personstore.get(data.id);
        shareholders.push(person);
    });
    
    return shareholders;
}

function getShares(id) {
    var teamdata = teamstore.find({ project: id });
    var sharedata = assignmentstore.find({ project: id });    
    var total = sl.aggr(sharedata, 'to', 'amount');
    total = sl.project(total, { to: 'id', amount: 'shares' });
    
    var shares = [];

    total.forEach(function (data) {
        var person = personstore.get(data.id);
        data.name = person.name;
        shares.push(data);
    });
    
    return shares;
}

function getProjects() {
    return store.find();
}

function addPeriod(projid, period, cb) {
    period.project = projid;
    periodstore.add(period, cb);
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

function removeAssignments(projectid, periodid, fromid) {
    var items = assignmentstore.find({ project: projectid, period: periodid, from: fromid });
    
    items.forEach(function (item) {
        assignmentstore.remove(item.id);
    });
}

function putAssignment(projectid, periodid, fromid, toid, amount, cb) {
    getPeriodById(periodid, function (err, period) {
        if (err) {
            cb(err, null);
            return;
        }
        
        getTotalAssignments(projectid, periodid, fromid, function (err, total) {
            if (err) {
                cb(err, null);
                return;
            }
            
            assignmentstore.find({ project: projectid, period: periodid, from: fromid, to: toid }, function (err, items) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                var olditem = (items && items.length) ? items[0] : null;
                var oldamount = olditem ? olditem.amount : 0;
                    
                var newtotal = total - oldamount + amount;
                
                if (newtotal > period.amount) {
                    cb(null, { error: 'You assigned too many shares' });;
                    return;
                }

                if (olditem) {
                    olditem.amount = amount;
                    assignmentstore.put(olditem.id, olditem, function(err, data) {
                        if (err)
                            cb(err, null);
                        else
                            cb(null, olditem.id);
                    });
                }
                else
                    assignmentstore.add({ project: projectid, period: periodid, from: fromid, to: toid, amount: amount }, function (err, id) {
                        if (err)
                            cb(err, null);
                        else
                            cb(null, id);
                    });
            });
        })
    });
    
}

function putAssignments(projectid, periodid, fromid, assignments, cb) {
    removeAssignments(projectid, periodid, fromid, function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var l = assigments.length;
        var k = 0;
        
        doAssigmentStep();
        
        function doAssignmentStep() {
            if (k >= l) {
                cb(null, true);
                return;
            }
            
            var assignment = assignments[n];
            putAssignment(projectid, periodid, fromid, assignment.to, assignment.amount, function (err, result) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                if (typeof result == 'object')
                    cb(null, result);
                else
                    setImmediate(doAssignmentStep);
            });
        }
    });
}

function getTotalAssignments(projectid, periodid, fromid, cb) {
    assignmentstore.find({ project: projectid, period: periodid, from: fromid }, function (err, items) {
        if (err) {
            cb(err, null);
            return;
        }
    
        var total = 0;
        
        items.forEach(function (item) {
            total += item.amount;
        });
        
        cb(null, total);
    });
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById,
    getProjects: getProjects,
    
    addPersonToTeam: addPersonToTeam,
    getTeam: getTeam,
    
    getShareholders: getShareholders,
    getShares: getShares,
    
    addPeriod: addPeriod,
    getPeriodById: getPeriodById,
    getPeriods: getPeriods,
    
    getAssignments: getAssignments,
    putAssignment: putAssignment,
    putAssignments: putAssignments,
    getTotalAssignments: getTotalAssignments,
    removeAssignments: removeAssignments
}

