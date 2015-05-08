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
var periodid;
var team;

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
            
            team = model.team;

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

exports['get new period'] = function (test) {
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

exports['add period'] = function (test) {
    test.async();

    async()
    .then(function (person, next) {
        var form = {
            name: 'First Period',
            amount: '100'
        }

        var request = {
            params: {
                id: projects[1].id.toString()
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
                test.equal(model.item.id, projects[1].id);
                test.equal(model.title, 'Project');

                var projectService = require('../services/project');

                projectService.getPeriodByName(projects[1].id, 'First Period', next);
            }
        };

        controller.addPeriod(request, response);
    })
    .then(function (period, next) {
        test.ok(period);
        test.ok(period.id);
        test.equal(period.name, 'First Period');
        test.equal(period.amount, 100);
        periodid = period.id;
        test.done();
    })
    .run();
};

exports['update period'] = function (test) {
    test.async();

    async()
    .then(function (person, next) {
        var form = {
            name: 'New Period',
            amount: '100',
            date: '2015-03-31'
        }

        var request = {
            params: {
                id: projects[1].id.toString(),
                idp: periodid.toString()
            },
            param: function (name) {
                return form[name];
            }
        };

        var response = {
            render: function (name, model) {
                test.ok(name);
                test.equal(name, 'periodview');
                test.ok(model);
                test.ok(model.item);
                test.ok(model.item.id);
                test.equal(model.item.id, periodid);
                test.equal(model.title, 'Period');

                var projectService = require('../services/project');

                projectService.getPeriodByName(projects[1].id, 'New Period', next);
            }
        };

        controller.updatePeriod(request, response);
    })
    .then(function (period, next) {
        test.ok(period);
        test.ok(period.id);
        test.equal(period.name, 'New Period');
        test.equal(period.amount, 100);
        test.equal(period.date, '2015-03-31');
        test.done();
    })
    .run();
};

exports['get period matrix'] = function (test) {
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
            test.equal(name, 'periodmatrix');
            test.ok(model);
            test.equal(model.title, 'Period Assignment Matrix');

            test.ok(model.project);
            test.ok(model.project.id);
            test.equal(model.project.id, project.id);

            test.ok(model.period);
            test.ok(model.period.id);
            test.equal(model.period.id, period.id);

            test.ok(model.team);
            test.ok(Array.isArray(model.team));
            test.ok(model.team.length);

            test.ok(model.shareholders);
            test.ok(Array.isArray(model.shareholders));
            test.ok(model.shareholders.length);

            test.done();
        }
    };

    controller.getPeriodMatrix(request, response);
};

exports['update period matrix'] = function (test) {
    test.async();
    
    var form = {
        from_1: team[0].id.toString(),
        from_2: team[1].id.toString(),
        from_3: team[2].id.toString(),
        to_1: team[0].id.toString(),
        to_2: team[1].id.toString(),
        to_3: team[2].id.toString(),
        assign_1_2: 40,
        assign_1_3: 60,
        assign_2_1: 30,
        assign_2_3: 70,
        assign_3_1: 50,
        assign_3_2: 50
    };

    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        },
        param: function (name) {
            return form[name];
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

    controller.updatePeriodMatrix(request, response);
};
