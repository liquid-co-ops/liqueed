'use strict';

var controller = require('../controllers/decisionapi');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var decisionService = require('../services/decision');
var projectService = require('../services/project');
var sl = require('simplelists');
var async = require('simpleasync');

var projects;
var project;
var decisions;
var decision;

exports['clear and load data'] = function (test) {
    test.async();

    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { projectService.getProjects(next); })
    .then(function (data, next) {
        projects = data;
        test.ok(projects);
        test.ok(projects.length);
        test.ok(sl.exist(projects, { name: 'FaceHub' }));

        project = sl.first(projects, { name: 'FaceHub' });
        decisionService.getDecisionsByProject(project.id, next);
    })
    .then(function (data, next) {
        decisions = data;
        test.ok(decisions);
        test.ok(decisions.length);

        decision = decisions[0];
        test.done();
    })
    .run();
};

exports['get decisions by project'] = function (test) {
    test.async();

    var request = {
        params: {
            projid: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.ok(model[0].id);
            test.ok(model[0].description);
            test.done();
        }
    };

    controller.list(request, response);
};
