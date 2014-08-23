'use strict';

var db = require('../utils/db');

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

function addPerson(data, cb) {
    store.add(data, cb);
}

function getPersonById(id, cb) {
    store.get(id, cb);
}

function getPersons(cb) {
    store.find(cb);
}

function getProjects(id, cb) {
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
    getPersons: getPersons,
    getProjects: getProjects
};

