'use strict';

var controller = require('../controllers/dcategory');

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
    
    var request = {
        params: {
            projectid: projects[0].id
        }
    };
    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'dcategorylist');
            test.ok(model);
            test.equal(model.title, 'Decision Categories');
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

exports['get new decision category'] = function (test) {
    test.async();
    
    var request = {
        params: {
            projectid: projects[0].id
        }
    };
    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'dcategorynew');
            test.ok(model);
            test.equal(model.title, 'New Decision Category');
            test.equal(model.projectid, projects[0].id);
            test.done();
        }
    };
    
    controller.newCategory(request, response);
};
