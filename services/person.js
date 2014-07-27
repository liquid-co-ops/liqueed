'use strict';

var db = require('../utils/db');

var store = db.store('persons');

function addPerson(data) {
    return store.add(data);
}

function getPersonById(id) {
    return store.get(id);
}

function getPersons() {
    return store.find();
}

function getProjects(id) {
    var tstore = db.store('teams');
    var pstore = db.store('projects');
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

