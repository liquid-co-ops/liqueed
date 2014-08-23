'use strict';

var db = require('../utils/db');

var store;

db.store('persons', function (err, data) {
    if (err)
        throw err;
    store = data;
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
    var tstore = db.store('teams');
    var pstore = db.store('projects');
    console.log('getProjects');
    var result = tstore.find({ person: id });
    
    var projects = [];
    var ids = { };
    
    result.forEach(function (team) {
        var id = team.project;
        
        if (ids[id])
            return;
            
        ids[id] = true;
            
        var project = pstore.get(id);
        
        if (project)
            projects.push(project);
    });
    
    return projects;
}

module.exports = {
    addPerson: addPerson,
    getPersonById: getPersonById,
    getPersons: getPersons,
    getProjects: getProjects
};

