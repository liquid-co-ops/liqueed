
var loaddata = require('../utils/loaddata');

var personService = require('../services/person');
var projectService = require('../services/project');var project;

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
    test.ok(projects.length);        project = projects[0];
};

exports['first project has team'] = function (test) {
    var team = projectService.getTeam(project.id);
    
    test.ok(team);
    test.ok(Array.isArray(team));
    test.ok(team.length);
    test.equal(team.length, 2);
    
    var alice = personService.getPersonById(team[0].person);
    
    test.ok(alice);
    test.equal(alice.name, 'Alice');
    
    var bob = personService.getPersonById(team[1].person);
    
    test.ok(bob);
    test.equal(bob.name, 'Bob');
}

exports['first project has periods'] = function (test) {
    var periods = projectService.getPeriods(project.id);
    
    test.ok(periods);
    test.ok(Array.isArray(periods));
    test.ok(periods.length);
    test.equal(periods.length, 2);
    
    test.equal(periods[0].name, 'January 2014');
    test.equal(periods[0].date, '2014-01-31');
    test.equal(periods[1].name, 'February 2014');
    test.equal(periods[1].date, '2014-02-28');
}

exports['clear data at end'] = function (test) {
    personService.clear();
    projectService.clear();
};

