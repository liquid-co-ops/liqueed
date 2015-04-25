'use strict';

var controller = require('../controllers/slackapi');

var async = require('simpleasync');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');

var persons;
var projects;

exports['clear and load data'] = function (test) {
    var personService = require('../services/person');
    var projectService = require('../services/project');

    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { projectService.getProjects(next); })
    .then(function (data, next) {
        projects = data;
        test.ok(projects);
        test.ok(projects.length);
        personService.getPersons(next);
    })
    .then(function (data, next) {
        persons = data;
        test.ok(persons);
        test.ok(persons.length);
        test.done();
    })
    .run();
};

exports['do test using query'] = function (test) {
    test.async();
    
    var request = {
        query: {
            name: 'Adam',
            age: 800
        }
    };
    
    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.name, 'Adam');
            test.equal(model.age, 800);
            test.done();
        }
    };
    
    controller.doTest(request, response);
};

exports['do test using body'] = function (test) {
    test.async();
    
    var request = {
        body: {
            name: 'Adam',
            age: 800
        }
    };
    
    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.name, 'Adam');
            test.equal(model.age, 800);
            test.done();
        }
    };
    
    controller.doTest(request, response);
};

exports['do slack test using body'] = function (test) {
    test.async();
    
    var request = {
        body: {
            name: 'Adam',
            age: 800
        }
    };
    
    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.name, 'Adam');
            test.equal(model.age, 800);
            test.done();
        }
    };
    
    controller.doSlack  (request, response);
};

exports['do slack person'] = function (test) {
    test.async();
    
    var request = {
        body: {
            text: 'person'
        }
    };
    
    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.equal(model.length, persons.length);
            
            persons.forEach(function (person) {
                test.ok(model.indexOf(person.username) >= 0);
            });
            
            test.done();
        }
    };
    
    controller.doSlack(request, response);
};

exports['do slack project'] = function (test) {
    test.async();
    
    var request = {
        body: {
            text: 'project'
        }
    };
    
    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.equal(model.length, projects.length);
            
            projects.forEach(function (project) {
                test.ok(model.indexOf(project.name) >= 0);
            });
            
            test.done();
        }
    };
    
    controller.doSlack(request, response);
};

