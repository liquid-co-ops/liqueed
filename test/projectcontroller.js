'use strict';

var controller = require('../controllers/project');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');
var sl = require('simplelists');

var projects;
var project;
var periods;
var period;

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

            project = sl.first(model.items, { name: 'FaceHub' });
            test.ok(project);

            test.done();
        }
    };

    controller.index(request, response);
};

exports['get new project'] = function (test) {
    test.async();

    var request = {};

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'projectnew');
            test.ok(model);
            test.equal(model.title, 'New Project');
            test.done();
        }
    };

    controller.newProject(request, response);
};

exports['add new project'] = function (test) {
    test.async();

    var formdata = {
        name: 'New Project'
    }

    var request = {
        param: function (name) {
            return formdata[name];
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'projectview');
            test.ok(model);
            test.equal(model.title, 'Project');
            test.ok(model.item);
            test.ok(model.item.id);
            test.equal(model.item.name, 'New Project');
            test.done();
        }
    };

    controller.addProject(request, response);
};

exports['get view first project'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'projectview');
            test.ok(model);
            test.equal(model.title, 'Project');

            test.ok(model.item);
            test.equal(model.item.id, project.id);
            test.equal(model.item.name, project.name);

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

    require('../services/project').getPeriods(project.id, function (err, data) {
        test.ok(!err);

        periods = data;
        period = periods[0];

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

exports['close first project first period'] = function (test) {
    test.async();

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
            test.equal(model.item.closed, true);

            test.ok(model.assignments);
            test.ok(Array.isArray(model.assignments));

            test.done();
        }
    };

    controller.closePeriod(request, response);
};

exports['open first project first period'] = function (test) {
    test.async();

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
            test.equal(model.item.closed, false);

            test.ok(model.assignments);
            test.ok(Array.isArray(model.assignments));

            test.done();
        }
    };

    controller.openPeriod(request, response);
};

exports['get new team member'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'teammembernew');
            test.ok(model);
            test.ok(model.item);
            test.ok(model.item.id)
            test.ok(model.persons);
            test.ok(model.persons.length);
            test.equal(model.title, 'Add to Team');
            test.done();
        }
    };

    controller.newTeamMember(request, response);
};

exports['add team member'] = function (test) {
    test.async();

    var personservice = require('../services/person');

    async()
    .then(function (data, next) { personservice.getPersonByName('Daniel', next); })
    .then(function (person, next) {
        var form = {
            person: person.id.toString()
        }

        var request = {
            params: {
                id: project.id.toString()
            },
            param: function (name) {
                return form[name];
            }
        };

        var response = {
            render: function (name, model) {
                test.ok(name);
                test.equal(name, 'projectview');
                test.ok(model);
                test.ok(model.item);
                test.ok(model.item.id);
                test.equal(model.item.id, project.id);
                test.equal(model.title, 'Project');

                var projectService = require('../services/project');

                projectService.getTeam(project.id, next);
            }
        };

        controller.addTeamMember(request, response);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(sl.exist(data, { name: 'Daniel' }));
        test.done();
    })
    .run();
};

exports['remove team member'] = function (test) {
    test.async();

    var personservice = require('../services/person');

    async()
    .then(function (data, next) { personservice.getPersonByName('Daniel', next); })
    .then(function (person, next) {
        var form = {
            person: person.id.toString()
        }

        var request = {
            params: {
                id: project.id.toString(),
                pid: person.id.toString()
            }
        };

        var response = {
            render: function (name, model) {
                test.ok(name);
                test.equal(name, 'projectview');
                test.ok(model);
                test.ok(model.item);
                test.ok(model.item.id);
                test.equal(model.item.id, project.id);
                test.equal(model.title, 'Project');

                var projectService = require('../services/project');

                projectService.getTeam(project.id, next);
            }
        };

        controller.removeTeamMember(request, response);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(!sl.exist(data, { name: 'Daniel' }));
        test.done();
    })
    .run();
};

exports['get new periods'] = function (test) {
    test.async();

    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'periodnew');
            test.ok(model);
            test.equal(model.title, 'New Period');
            test.ok(model.project);
            test.ok(model.project.id);
            test.equal(model.project.id, project.id);
            test.done();
        }
    };

    controller.newPeriod(request, response);
};
