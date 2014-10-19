'use strict';

var controller = require('../controllers/projectapi');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var personService = require('../services/person');
var projectService = require('../services/project');
var sl = require('simplelists');
var async = require('simpleasync');

var projects;
var project;
var team;
var periods;
var period;

exports['use db'] = function (test) {
    test.async();

    db.useDb('liqueed-test', null, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
}

exports['clear and load data'] = function (test) {
    test.async();

    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { projectService.getProjects(next); })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 0);
        loaddata(next);
    })
    .then(function (data, next) { projectService.getProjects(next); })
    .then(function (data, next) {
        projects = data;
        test.ok(projects);
        test.ok(projects.length);

        project = projects[0];
        projectService.getPeriods(project.id, next);
    })
    .then(function (data, next) {
        periods = data;
        test.ok(periods);
        test.ok(periods.length);

        period = periods[0];
        projectService.getTeam(project.id, next);
    })
    .then(function (data, next) {
        team = data;
        test.ok(team);
        test.ok(team.length);
        test.done();
    })
    .run();
};

exports['get list'] = function (test) {
    test.async();

    var request = {};

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.ok(model[0].id);
            test.ok(model[0].name);
            test.done();
        }
    };

    controller.list(request, response);
};

exports['get first project'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.id, projects[0].id);
            test.equal(model.name, projects[0].name);

            test.done();
        }
    };

    controller.get(request, response);
};

exports['get first project team'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 3);
            test.equal(model[0].name, 'Alice');
            test.equal(model[1].name, 'Bob');
            test.equal(model[2].name, 'Charlie');

            test.done();
        }
    };

    controller.getTeam(request, response);
};

exports['get first project shareholders'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 3);
            test.equal(model[0].name, 'Alice');
            test.equal(model[1].name, 'Bob');
            test.equal(model[2].name, 'Charlie');

            test.done();
        }
    };

    controller.getShareholders(request, response);
};

exports['get first project periods'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 2);
            test.equal(model[0].name, 'January 2014');
            test.equal(model[0].date, '2014-01-31');
            test.equal(model[1].name, 'February 2014');
            test.equal(model[1].date, '2014-02-28');

            test.done();
        }
    };

    controller.getPeriods(request, response);
};

exports['get first project first period'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.equal(model.name, 'January 2014');
            test.equal(model.date, '2014-01-31');

            test.done();
        }
    };

    controller.getPeriod(request, response);
};

exports['get first project first period assignments'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.equal(model.length, 6);

            test.done();
        }
    };

    controller.getAssignments(request, response);
};

exports['get first project first period put assignment'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        },
        body: {
            from: team[0].id.toString(),
            to: team[1].id.toString(),
            amount: 1,
            note: 'a note'
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(model.id);

            projectService.getAssignments(period.id, function (err, assignments) {
                test.ok(!err);
                var assignment;

                for (var k in assignments)
                    if (assignments[k].from.id == team[0].id && assignments[k].to.id == team[1].id && assignments[k].amount == 1) {
                        assignment = assignments[k];
                        break;
                    }

                test.ok(assignment);

                test.done();
            });
        }
    };

    controller.putAssignment(request, response);
};

exports['get first project first period put assignments'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        },
        body: {
            from: team[0].id,
            assignments: [
                { to: team[1].id, amount: 10, note: 'note 1' },
                { to: team[2].id, amount: 90, note: 'note 2' }
            ]
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            var assignments = projectService.getAssignments(period.id, function (err, assignments) {
                test.ok(!err);
                var assignment;
                var found = 0;

                for (var k in assignments)
                    if (assignments[k].from.id == team[0].id && assignments[k].to.id == team[1].id && assignments[k].amount == 10)
                        found++;
                    else if (assignments[k].from.id == team[0].id && assignments[k].to.id == team[2].id && assignments[k].amount == 90)
                        found++;

                test.equal(found, 2);

                test.done();
            });
        }
    };

    controller.putAssignments(request, response);
};

exports['close db'] = function (test) {
    test.async();

    db.closeDb(function (err, data) {
        test.ok(!err);
        test.ok(!data);
        test.done();
    });
}
