
var personService = require('../services/person');
var projectService = require('../services/project');

function load(filename) {
    if (!filename)
        filename = '../data.json';
        
    var data = require(filename);
    
    data.persons.forEach(function (person) {
        personService.addPerson(person);
    });

    data.projects.forEach(function (project) {
        var team = project.team;
        var periods = project.periods;
        
        delete project.team;
        delete project.periods;
        
        projectService.addProject(project);
    });
}module.exports = load;