
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
            id: projects[0].id
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
            test.done();
        }
    };
    
    controller.view(request, response);
};
