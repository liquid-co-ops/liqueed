'use strict';

var db = require('../utils/db');
var async = require('simpleasync');
var sl = require('simplelists');

function addProject(data, cb) {
    var store = db.store('projects');
    store.add(data, cb);
}

function getProjectById(id, cb) {
    var store = db.store('projects');
    store.get(id, cb);
}

function addPersonToTeam(projid, personid, cb) {
    var teamstore = db.store('teams');
    teamstore.add({ project: projid, person: personid }, cb);
}

function getTeam(id, cb) {
    var teamstore = db.store('teams');

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

function getShareholders(id, cb) {
    var teamdata;
    var sharedata;
    var teamstore = db.store('teams');
    var personstore = db.store('persons');
    var assignmentstore = db.store('assignments');
    
    async()
    .then(function (data, next) {
        teamstore.find({ project: id }, next);
    })
    .then(function (data, next) {
        teamdata = data;
        assignmentstore.find({ project: id }, next);
    })
    .then(function (data, next) {
        sharedata = data;
        
        var ids = sl.project(teamdata, { person: 'id' });
        ids = sl.union(ids, sl.project(sharedata, { to: 'id' }), 'id');
        ids = sl.union(ids, sl.project(sharedata, { from: 'id' }), 'id');
        
        next(null, ids);
    })
    .map(function (item, next) {
        personstore.get(item.id, next);
    })
    .then(function (shareholders) {
        cb(null, shareholders);
    })
    .fail(function (err) { cb(err, null); })
    .run();
}

function getShares(id, cb) {
    var teamdata;
    var sharedata;

    var teamstore = db.store('teams');
    var assignmentstore = db.store('assignments');
    var personstore = db.store('persons');
    
    async()
    .then(function (data, next) {
        teamstore.find({ project: id }, next);
    })
    .then(function (data, next) {
        teamdata = data;
        assignmentstore.find({ project: id }, next);  
    })
    .then(function (data, next) {
        sharedata = data;
        var total = sl.aggr(sharedata, 'to', 'amount');
        total = sl.project(total, { to: 'id', amount: 'shares' });
        next(null, total);
    })
    .map(function (data, next) {
        personstore.get(data.id, function (err, person) {
            if (err)
                next(err, null);
            else {
                data.name = person.name;
                next(null, data);
            }
        });
    })
    .then(function (shares, next) {
        cb(null, shares);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function getProjects(cb) {
    var store = db.store('projects');
    store.find(cb);
}

function addPeriod(projid, period, cb) {
    var periodstore = db.store('periods');
    period.project = projid;
    periodstore.add(period, cb);
}

function getPeriodById(periodid, cb) {
    var periodstore = db.store('periods');
    periodstore.get(periodid, cb);
}

function getPeriods(projid, cb) {
    var periodstore = db.store('periods');
    periodstore.find({ project: projid }, cb);
}

function getAssignments(periodid, cb) {
    var assignmentstore = db.store('assignments');
    var sperson = require('./person');    
    assignmentstore.find({ period: periodid }, function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var list = [];
        
        var l = data.length;
        var k = 0;
        
        doDataStep();
        
        function doDataStep() {
            if (k >= l) {
                cb(null, list);
                return;
            }
            
            var item = data[k++];
            
            var assignment = { id: item.id, amount: item.amount };

            sperson.getPersonById(item.from, function (err, personid) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                assignment.from = personid;
                
                sperson.getPersonById(item.to, function (err, personid) {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                    
                    assignment.to = personid;
                    
                    list.push(assignment);
                    
                    setImmediate(doDataStep);
                });
            })
        }
    });
}

function removeAssignments(projectid, periodid, fromid, cb) {
    var assignmentstore = db.store('assignments');

    async()
    .then(function (data, next) {
        assignmentstore.find({ project: projectid, period: periodid, from: fromid }, next);
    })
    .map(function (item, next) {
        assignmentstore.remove(item.id, next);
    })
    .then(function (data, next) {
        cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function putAssignment(projectid, periodid, fromid, toid, amount, cb) {
    var assignmentstore = db.store('assignments');

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
        
        var l = assignments.length;
        var k = 0;
        
        doAssignmentStep();
        
        function doAssignmentStep() {
            if (k >= l) {
                cb(null, true);
                return;
            }
            
            var assignment = assignments[k++];
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
    var assignmentstore = db.store('assignments');
    
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

