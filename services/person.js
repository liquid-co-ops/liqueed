'use strict';

var db = require('../utils/db');
var async = require('simpleasync');

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

function makeUserName(name) {
    return name.split(' ').join('_').toLowerCase();
}

function addPerson(data, cb) {
    var store = db.store('persons');
    
    if (!data.username && data.name)
        data.username = makeUserName(data.name);
        
    store.add(data, cb);
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
        
        if (username != password) {
            cb('Invalid password', null);
            return;
        }
        
        cb(null, data);
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
                
                if (person.name && makeUserName(person.name) == username) {
                    person.username = makeUserName(person.name);
                    cb(null, person);
                    return;
                }
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

module.exports = {
    addPerson: addPerson,
    getPersonById: getPersonById,
    getPersonByName: getPersonByName,
    getPersonByUserName: getPersonByUserName,
    getPersons: getPersons,
    getProjects: getProjects,
    loginPerson: loginPerson
};

