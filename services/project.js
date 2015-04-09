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

function getProjectByName(name, cb) {
    var store = db.store('projects');
    store.find({ name: name }, function (err, items) {
        if (err) {
            cb(err, null);
            return;
        }
        
        if (items.length)
            cb(null, items[0]);
        else
            cb(null, null);
    });
}

function addPersonToTeam(projid, personid, cb) {
    var teamstore = db.store('teams');
    teamstore.find({ project: projid, person: personid }, function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        if (data.length)
            cb(null, data[0].id);
        else
            teamstore.add({ project: projid, person: personid }, cb);
    });
}

function removePersonFromTeam(projid, personid, cb) {
    var teamstore = db.store('teams');
    teamstore.find({ project: projid, person: personid }, function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        if (data.length)
            teamstore.remove(data[0].id, cb);
        else
            cb(null, null);
    });
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

function getTeamAssignments(projectid, periodid, cb) {
    var team;
    
    async()
    .then(function (data, next) {
        getTeam(projectid, next);
    })
    .then(function (data, next) {
        team = data;
        getAssignmentList({ project: projectid, periodid: periodid }, next);
    })
    .then(function (data, next) {
        var result = [];
        var records = {};
        
        team.forEach(function(person) {
            var record = { id: person.id, name: person.name, username: person.username, assignment: false };
            result.push(record);
            records[record.id] = record;
        });
        
        data.forEach(function (assignment) {
            if (assignment.from && assignment.from.id && records[assignment.from.id])
                records[assignment.from.id].assignment = true;
        });
        
        cb(null, result);
    })
    .run();
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

function getReceivedAssignmentsByProjectPerson(projectid, personid, cb) {
    getAssignmentList({ project: projectid, to: personid }, cb);
}

function getGivenAssignmentsByProjectPerson(projectid, personid, cb) {
    getAssignmentList({ project: projectid, from: personid }, cb);
}

function getAssignmentList(filter, cb) {
    var assignmentstore = db.store('assignments');
    var personstore = db.store('persons');
    var periodstore = db.store('periods');
    
    var periods;
    
    var pers = { };
    var prds = { };
    
    async()
    .then(function (data, next) {
        if (filter && filter.project)
            periodstore.find({ project: filter.project }, next);
        else
            periodstore.find(next);  
    })
    .then(function (data, next) {
        periods = data;
        assignmentstore.find(filter, next);  
    })
    .map(function (data, next) {
        if (filter.to) {
            next(null, data);
            return;
        }
        
        if (pers[data.to]) {
            data.to = pers[data.to];
            next(null, data);
            return;
        }
        
        personstore.get(data.to, function (err, person) {
            if (err) {
                next(err, null);
                return;
            }
            
            var per = {
                id: person.id,
                name: person.name                
            }
            
            pers[data.to] = per;
            data.to = per;
            
            next(null, data);
        });
    })
    .map(function (data, next) {        
        if (prds[data.period]) {
            data.period = prds[data.period];
            
            if (!data.date && data.period.date)
                data.date = data.period.date;
                
            next(null, data);
            return;
        }
        
        periodstore.get(data.period, function (err, period) {
            if (err) {
                next(err, null);
                return;
            }
            
            var prd = {
                id: period.id,
                name: period.name,
                date: period.date,
                closed: period.closed
            }
            
            prds[data.period] = prd;
            data.period = prd;
            
            if (!data.date && data.period.date)
                data.date = data.period.date;
            
            next(null, data);
        });
    })
    .map(function (data, next) {
        if (filter.from) {
            next(null, data);
            return;
        }
        
        if (pers[data.from]) {
            data.from = pers[data.from];
            next(null, data);
            return;
        }
        
        personstore.get(data.from, function (err, person) {
            if (err) {
                next(err, null);
                return;
            }
            
            var per = {
                id: person.id,
                name: person.name                
            }
            
            pers[data.from] = per;
            data.from = per;
            
            next(null, data);
        });
    })
    .then(function (data, next) {
        cb(null, data);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function getSharesByProject(projectid, options, cb) {
    if (!cb && typeof options == 'function') {
        cb = options;
        options = null;
    }
    
    getShares({ project: projectid }, options, cb);
}

function getSharesByPeriod(projectid, periodid, options, cb) {
    if (!cb && typeof options == 'function') {
        cb = options;
        options = null;
    }
    
    getShares({ project: projectid, period: periodid }, options, cb);
}

function getShares(filter, options, cb) {
    options = options || { };
    
    var sharedata;

    var assignmentstore = db.store('assignments');
    var personstore = db.store('persons');
    var periodstore = db.store('periods');
    
    var periods;
    
    async()
    .then(function (data, next) {
        if (filter && filter.project)
            periodstore.find({ project: filter.project }, next);
        else
            periodstore.find(next);  
    })
    .then(function (data, next) {
        periods = data;
        assignmentstore.find(filter, next);  
    })
    .then(function (data, next) {
        sharedata = data;
        
        if (options.closed)
            sharedata = sl.where(sharedata, function (item) {
                var period = sl.first(periods, { id: item.period });
                if (!period)
                    return false;
                return period.closed;
            });
        
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
    
	// validation
	if (!projid) {
		cb('the project id is undefined',null);
		return;
	}
	if (!period) {
		cb('the period to be created is not defined',null);
		return;
	}
	if (!period.name) {
		cb('A period name is needed',null);
		return;
	}
	if (!period.amount || isNaN(period.amount) || period.amount <= 0) {
		cb('You should input an amount > 0',null);
		return;
	}

	getPeriods(projid, function(err, result) {
		if (err) {
			cb(err, null);
			return;
		}

		for ( var n in result) {
			var aPeriod = result[n];
			if (!aPeriod.closed) {
				cb('There is an open period, to create another all periods should be closed',null);
				return;
			}
			if (aPeriod.name === period.name) {
				cb('Already exist a period with the same name',null);
				return;
			}
		}

		// create period
		period.project = projid;
		var today = new Date();
		if(!period.date) {
			period.date = [ today.getFullYear(),("00" + (today.getMonth() + 1)).slice(-2),("00" + today.getDate()).slice(-2) ].join('-');
		}
		period.closed = false;

		var periodstore = db.store('periods');
		periodstore.add(period, cb);		
	});	 

}

function getPeriodById(periodid, cb) {
    var periodstore = db.store('periods');
    periodstore.get(periodid, cb);
}

function getPeriodByName(projectid, periodname, cb) {
    var periodstore = db.store('periods');
    periodstore.find({ project: projectid, name: periodname }, function (err, items) {
        if (err)
            cb(err, null);
        else if (items.length)
            cb(null, items[0]);
        else
            cb(null, null);
    });
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
            var assignment = { id: item.id, project: item.project, period: item.period, amount: item.amount, note: item.note};

            sperson.getPersonById(item.from, function (err, personid) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                assignment.from = {
                    id: personid.id,
                    username: personid.username,
                    name: personid.name
                };
                
                sperson.getPersonById(item.to, function (err, personid) {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                    
                    assignment.to = {
                        id: personid.id,
                        username: personid.username,
                        name: personid.name
                    };
                    
                    list.push(assignment);
                    
                    setImmediate(doDataStep);
                });
            });
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

function putAssignment(projectid, periodid, fromid, toid, amount, note, cb) {
    var assignmentstore = db.store('assignments');
    
    var period;
    var total;
    var items;
    var assignid;
    var totalassigned;
    
    async()
    .then(function (data, next)  {
        if(!note) 
        {
            cb('Note cannot be empty', null);
            return;
        }
        next(null, data);
    })
    .then(function (data, next) { getPeriodById(periodid, next); })
    .then(function (data, next) { period = data; getTotalAssignments(projectid, periodid, fromid, next); })
    .then(function (data, next) { total = data; assignmentstore.find({ project: projectid, period: periodid, from: fromid, to: toid }, next); })
    .then(function (data, next) {
        items = data;
        var olditem = (items && items.length) ? items[0] : null;
        var oldamount = olditem ? olditem.amount : 0;
        var newtotal = total - oldamount + amount;
        
        if (newtotal > period.amount) {
            cb(null, { error: 'You assigned too many shares' });
            return;
        }

        if (olditem) {
            olditem.amount = amount;
            olditem.note = note;

            assignmentstore.put(olditem.id, olditem, function(err, data) {
                if (err)
                    next(err, null);
                else
                    next(null, olditem.id);
            });
        }
        else
            assignmentstore.add({ project: projectid, period: periodid, from: fromid, to: toid, amount: amount, note: note }, function (err, id) {
                if (err)
                    next(err, null);
                else
                    next(null, id);
            });
    })
    .then(function (data, next) {
        assignid = data;
        
        assignmentstore.find({ project: projectid, period: periodid }, next);
    })
    .then(function (data, next) {
        totalassigned = sl.sum(data, 'amount');
        getTeam(projectid, next);
    })
    .then(function (data, next) {
        var nteam = data.length;
        var closed = totalassigned >= nteam * period.amount;
        
        if (closed != period.closed) {
            var periodstore = db.store('periods');
            periodstore.update(period.id, { closed: closed }, next);
        }
        else
            next(null, null);
    })
    .then(function (data, next) { cb(null, assignid); })
    .fail(function (err) { cb(err, null); })
    .run();
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
            putAssignment(projectid, periodid, fromid, assignment.to, assignment.amount, assignment.note, function (err, result) {
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

function getTotalSharesByProject(projectid, options, cb) {
    if (!cb && typeof options == 'function') {
        cb = options;
        options = null;
    }
    
    options = options || { };
    
    var assignmentstore = db.store('assignments');
    var periodstore = db.store('periods');

    periodstore.find({ project: projectid }, function (err, periods) {    
        if (err) {
            cb(err, null);
            return;
        }
        
        assignmentstore.find({ project: projectid }, function (err, items) {
            if (err) {
                cb(err, null);
                return;
            }
        
            var total = 0;
            
            items.forEach(function (item) {
                if (options.closed) {
                    if (!item.period)
                        return;
                    var period = sl.first(periods, { id: item.period });
                    if (!period || !period.closed)
                        return;
                }
                
                total += item.amount;
            });
            
            cb(null, total);
        });
    });
}

function setPeriodClosed(projectid, periodid, closed, cb) {
    var periodstore = db.store('periods');
    periodstore.update(periodid, { closed: closed }, cb);
}

function openPeriod(projectid, periodid, cb) {
    setPeriodClosed(projectid, periodid, false, cb);
}

function closePeriod(projectid, periodid, cb) {
    setPeriodClosed(projectid, periodid, true, cb);
}

module.exports = {
    addProject: addProject,
    getProjectById: getProjectById,
    getProjectByName: getProjectByName,
    getProjects: getProjects,
    
    addPersonToTeam: addPersonToTeam,
    removePersonFromTeam: removePersonFromTeam,
    getTeam: getTeam,
    getTeamAssignments: getTeamAssignments,
    
    getShareholders: getShareholders,
    getSharesByProject: getSharesByProject,
    getSharesByPeriod: getSharesByPeriod,
    getTotalSharesByProject: getTotalSharesByProject,
    
    getGivenAssignmentsByProjectPerson: getGivenAssignmentsByProjectPerson,
    getReceivedAssignmentsByProjectPerson: getReceivedAssignmentsByProjectPerson,
    
    addPeriod: addPeriod,
    getPeriodById: getPeriodById,
    getPeriodByName: getPeriodByName,
    getPeriods: getPeriods,
    
    getAssignments: getAssignments,
    putAssignment: putAssignment,
    putAssignments: putAssignments,
    getTotalAssignments: getTotalAssignments,
    removeAssignments: removeAssignments,
    
    openPeriod: openPeriod,
    closePeriod: closePeriod
};

