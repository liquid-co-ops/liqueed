
var loaddata = require('../utils/loaddata');

var personService = require('../services/person');
var projectService = require('../services/project');

exports['clear data at start'] = function (test) {
    personService.clear();
    projectService.clear();
};

exports['load initial data simple test'] = function (test) {
    loaddata();
    
    var persons = personService.getPersons();
    test.ok(persons);
    test.ok(Array.isArray(persons));
    test.ok(persons.length);
    
    var projects = projectService.getProjects();
    test.ok(projects);
    test.ok(Array.isArray(projects));
    test.ok(projects.length);
};

exports['clear data at end'] = function (test) {
    personService.clear();
    projectService.clear();
};