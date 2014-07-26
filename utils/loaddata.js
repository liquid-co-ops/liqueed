
var personService = require('../services/person');
var projectService = require('../services/project');

function load(filename) {
    if (!filename)
        filename = '../data.json';
        
    var data = require(filename);        var persons = { };
    
    data.persons.forEach(function (person) {
        var id = personService.addPerson(person);        persons[person.name] = id;
    });

    data.projects.forEach(function (project) {
        var team = project.team;
        var periods = project.periods;
        
        delete project.team;
        delete project.periods;
        
        var projid = projectService.addProject(project);                team.forEach(function (name) {            var personid = persons[name];                        if (personid)                projectService.addPersonToTeam(projid, personid);        });
    });
}module.exports = load;