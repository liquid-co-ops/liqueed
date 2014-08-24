
var controller = require('../controllers/project');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');

var projects;

exports['clear and load data'] = function (test) {
    test.async();
    
    var projectService = require('../services/project');

    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { projectService.getProjects(next); })
    .then(function (data, next) {
        projects = data;
        test.ok(projects);
        test.ok(projects.length);
        test.done();
    })
    .run();
};

exports['get index'] = function (test) {
    test.async();
    
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
    test.async();
    
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
    test.async();
    
    var project = projects[0];
    require('../services/project').getPeriods(project.id, function (err, periods) {
        test.ok(!err);
        
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
    });
};
