'use strict';

var db = require('../utils/db');
var async = require('simpleasync');
var bcrypt = require('bcrypt-nodejs');

var store;

db.store('persons', function (err, data) {
    store = data;
});

var tstore;

db.store('teams', function (err, data) {
    tstore = data;
});

var pstore;

db.store('projects', function (err, data) {
    pstore = data;
});

function makeUsername(name) {
    return name.split(' ').join('_').toLowerCase();
}

function makePassword(username) {
    return bcrypt.hashSync(username);
}

function addPerson(data, cb) {
    var store = db.store('persons');

    completePerson(data);
        
    store.add(data, cb);
}

function updatePerson(id, data, cb) {
    var store = db.store('persons');
    
    if (data.password && data.password.length < 20)
        data.password = makePassword(data.password);
        
    store.update(id, data, cb);
}

function getPersonById(id, cb) {
    var store = db.store('persons');
    store.get(id, cb);
}

function loginPerson(username, password, cb) {
    async()
    .then(function (data, next) {
        getPersonByUserName(username, next);
    })
    .then(function (data, next) {
        if (!data) {
            cb('Unknown username', null);
            return;
        }   
        
        bcrypt.compare(password, data.password, function (err, res) {
            if (err || !res) {
                cb('Invalid password', null);
                return;
            }

            cb(null, data);
        });
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function getPersonByName(name, cb) {
    var store = db.store('persons');
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

function getPersonByUserName(username, cb) {
    var store = db.store('persons');
    store.find({ username: username }, function (err, items) {
        if (err) {
            cb(err, null);
            return;
        }
        
        if (items.length) {
            cb(null, items[0]);
            return;
        }
        
        getPersons(function (err, persons) {
            if (err) {
                cb(err, null);
                return;
            }
            
            for (var n in persons) {
                var person = persons[n];
                
                if (person.name && makeUsername(person.name) == username) {
                    person.username = makeUsername(person.name);
                    cb(null, person);
                    return;
                }
                
                if (person.password)
                    delete person.password;
            }
            
            cb(null, null);
        });
    });
}

function getPersons(cb) {
    var store = db.store('persons');
    store.find(cb);
}

function getProjects(id, cb) {
    var tstore = db.store('teams');
    var pstore = db.store('projects');
    
    tstore.find({ person: id }, function (err, result) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var projects = [];
        var ids = { };
        
        var l = result.length;
        var k = 0;
        
        doTeamStep();
        
        function doTeamStep() {
            if (k >= l) {
                cb(null, projects);
                return;
            } 
             
            var team = result[k++];
            var id = team.project;
            
            if (ids[id]) {
                setImmediate(doTeamStep);
                return;
            }
                
            ids[id] = true;
            pstore.get(id, function (err, project) {
                if (err)
                    cb(err, null);
                else {
                    if (project)
                        projects.push(project);
                    setImmediate(doTeamStep);
                }
            });
        }
    });
}

function completePerson(person) {
    if (!person.username)
        person.username = makeUsername(person.name);
        
    if (!person.password)
        person.password = makePassword(person.username);
    else if (person.password.length < 30)
        person.password = makePassword(person.password);
}

function normalizePersons(cb) {
    var store = db.store('persons');
    
    async()
    .then(function (data, next) {
        getPersons(next);
    })
    .map(function (person, next) {
        if (person.username && person.password)
            next(null, person);
        else {
            if (!person.username)
                person.username = makeUsername(person.name);
            if (!person.password)
                person.password = makePassword(person.username);
            store.update(person.id, { username: person.username, password: person.password }, function (err, data) {
                if (err)
                    next(err, null);
                else
                    next(null, person);
            });
        }
    })
    .then(function (data, next) {
        cb(null, next);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function getPendingShareProjects(userid, cb) {
	var result = [];
	var projects = [];
	var projectsopen = [];
    async()
    .then(function(data, next) {
		getProjects(userid, next);
	})
	.then(function(fprojects, next) {
		var periodstore = db.store('periods');
		if (fprojects.length > 0) {
			projects = fprojects;
			periodstore.find({closed : false }, next);
		} else {
			cb(null, result);
		}
	})
	.then(function(periods, next) {
		if (periods.length > 0) {
			for (var h = 0; h < periods.length; h++) {
				for (var i = 0; i < projects.length; i++) {
					if (periods[h].project === projects[i].id) {
						projectsopen.push(projects[i]);
					}
				}
			}
			next(null, projectsopen);
		} else {
			cb(null, result);
		}
    })
    .then(function(fprojects, next) {
		var assignmentstore = db.store('assignments');
		assignmentstore.find({from : userid}, next);
	})
	.then(function(assignments, next) {
		if (assignments.length > 0) {
			for (var i = 0; i < projectsopen.length; i++) {
				var hasAssignment = false;
				for (var j = 0; j < assignments.length; j++) {
						if (assignments[j].project === projectsopen[i].id) {
							hasAssignment = true;
							break;
						}
					}
				if (!hasAssignment) {
					result.push(projectsopen[i]);
				}
			}
			next(null, result);
		} else {
			next(null, projectsopen);
		}
    })
    .then(function (data, next) {
        cb(null, data);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

module.exports = {
    addPerson: addPerson,
    updatePerson: updatePerson,
    getPersonById: getPersonById,
    getPersonByName: getPersonByName,
    getPersonByUserName: getPersonByUserName,
    getPersons: getPersons,
    getProjects: getProjects,
    loginPerson: loginPerson,
    normalizePersons: normalizePersons,
    getPendingShareProjects: getPendingShareProjects
};

