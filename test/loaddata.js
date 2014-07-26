
var loaddata = require('../utils/loaddata');

var personService = require('../services/person');
var projectService = require('../services/project');var project;var period;

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
    test.equal(team.length, 3);    
    var alice = team[0];
    
    test.ok(alice);
    test.equal(alice.name, 'Alice');
    
    var bob = team[1];
    
    test.ok(bob);
    test.equal(bob.name, 'Bob');
        var charlie = team[2];        test.ok(charlie);    test.equal(charlie.name, 'Charlie');}

exports['first project has periods'] = function (test) {
    var periods = projectService.getPeriods(project.id);
    
    test.ok(periods);
    test.ok(Array.isArray(periods));
    test.ok(periods.length);
    test.equal(periods.length, 2);
    
    test.equal(periods[0].name, 'January 2014');
    test.equal(periods[0].date, '2014-01-31');
    test.equal(periods[1].name, 'February 2014');
    test.equal(periods[1].date, '2014-02-28');        period = periods[0];
}
exports['first project first period has assigments'] = function (test) {    var assignments = projectService.getAssignments(period.id);        test.ok(assignments);    test.ok(Array.isArray(assignments));    test.ok(assignments.length);    test.equal(assignments.length, 6);        test.equal(assignments[0].from.name, 'Alice');    test.equal(assignments[0].to.name, 'Bob');    test.equal(assignments[0].amount, 50);        test.equal(assignments[1].from.name, 'Alice');    test.equal(assignments[1].to.name, 'Charlie');    test.equal(assignments[1].amount, 50);}
exports['clear data at end'] = function (test) {
    personService.clear();
    projectService.clear();
};

