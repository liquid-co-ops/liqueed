
var controller = require('../controllers/project');
var loaddata = require('../utils/loaddata');

var projects;

exports['clear and load data'] = function (test) {
    var personService = require('../services/person');
    var projectService = require('../services/project');
    personService.clear();
    projectService.clear();
    loaddata();
    
    projects = projectService.getProjects();
    
    test.ok(projects);
    test.ok(projects.length);
};

exports['get index'] = function (test) {
    var request = {};

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'projectlist');
            test.ok(model);
            test.equal(model.title, 'Projects');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].id);
            test.ok(model.items[0].name);
            test.done();
        }
    };
    
    controller.index(request, response);
};

exports['get view first project'] = function (test) {
    var request = {
        params: {
            id: projects[0].id.toString()
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'projectview');
            test.ok(model);
            test.equal(model.title, 'Project');
            
            test.ok(model.item);
            test.equal(model.item.id, projects[0].id);
            test.equal(model.item.name, projects[0].name);
            
            test.ok(model.team);
            test.ok(Array.isArray(model.team));
            test.equal(model.team.length, 3);
            
            test.ok(model.team[0].id);
            test.equal(model.team[0].name, 'Alice');
            test.ok(model.team[1].id);
            test.equal(model.team[1].name, 'Bob');
            test.ok(model.team[2].id);
            test.equal(model.team[2].name, 'Charlie');
            
            test.ok(model.periods);
            test.ok(Array.isArray(model.periods));
            test.equal(model.periods.length, 2);
            test.equal(model.periods[0].name, 'January 2014');
            test.equal(model.periods[0].date, '2014-01-31');
            test.equal(model.periods[0].amount, 100);
            test.equal(model.periods[1].name, 'February 2014');
            test.equal(model.periods[1].date, '2014-02-28');
            test.equal(model.periods[1].amount, 100);
            
            test.done();
        }
    };
    
    controller.view(request, response);
};
exports['get view first project first period'] = function (test) {
    var project = projects[0];
    var periods = require('../services/project').getPeriods(project.id);
    var period = periods[0];
    
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'periodview');
            test.ok(model);
            test.equal(model.title, 'Period');
            
            test.ok(model.project);
            test.equal(model.project.id, project.id);
            test.equal(model.project.name, project.name);
            
            test.ok(model.item);
            test.equal(model.item.id, period.id);
            test.equal(model.item.name, period.name);
            test.equal(model.item.date, period.date);
            test.equal(model.item.amount, period.amount);
            
            test.ok(model.assignments);
            test.ok(Array.isArray(model.assignments));
            
            test.done();
        }
    };
    
    controller.viewPeriod(request, response);
};
