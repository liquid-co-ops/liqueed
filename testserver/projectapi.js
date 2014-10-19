'use strict';

var app = require('../app');
var api = require('./utils/api');
var sl = require('simplelists');
var async = require('simpleasync');

var server;
var projects;
var project;
var periods;
var period;

exports['load test data'] = function (test) {
    test.async();

    var loaddata = require('../utils/loaddata');
    loaddata(function (err, data) {
        test.ok(!err);
        test.done();
    });
}

exports['start server'] = function (test) {
    server = app.listen(3000);
}

exports['get projects'] = function (test) {
    test.async();

    api.doRequest('GET', 'http://localhost:3000/api/project', function (err, data) {
        test.ok(!err);
        test.ok(data);
        var result = JSON.parse(data);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        projects = result;

        project = sl.first(projects, { name: 'FaceHub' });
        test.ok(project);

        test.done();
    });
}

exports['get first project'] = function (test) {
    test.async();

    api.doRequest('GET', 'http://localhost:3000/api/project/' + project.id, function (err, data) {
        test.ok(!err);
        test.ok(data);
        var result = JSON.parse(data);
        test.ok(result);

        test.equal(result.id, project.id);
        test.equal(result.name, project.name);

        test.done();
    });
}

exports['get shares of first project'] = function (test) {
    test.async();

    api.doRequest('GET', 'http://localhost:3000/api/project/' + project.id + '/share', function (err, data) {
        test.ok(!err);
        test.ok(data);
        var result = JSON.parse(data);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);

        test.done();
    });
}

exports['get periods of first project'] = function (test) {
    test.async();

    api.doRequest('GET', 'http://localhost:3000/api/project/' + project.id + '/period', function (err, data) {
        test.ok(!err);
        test.ok(data);
        var result = JSON.parse(data);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);

        periods = result;
        period = periods[0];

        test.done();
    });
}

exports['close period'] = function (test) {
    test.async();

    api.doRequest('PUT', 'http://localhost:3000/api/project/' + project.id + '/period/' + period.id + '/close', function (err, data) {
        test.ok(!err);
        test.ok(data);

        api.doRequest('GET', 'http://localhost:3000/api/project/' + project.id + '/period/' + period.id, function (err, data) {
            var result = JSON.parse(data);
            test.ok(result);
            test.ok(result.name);
            test.ok(result.date);
            test.equal(result.closed, true);

            test.done();
        });
    });
}

exports['open period'] = function (test) {
    test.async();

    api.doRequest('PUT', 'http://localhost:3000/api/project/' + project.id + '/period/' + period.id + '/open', function (err, data) {
        test.ok(!err);
        test.ok(data);

        api.doRequest('GET', 'http://localhost:3000/api/project/' + project.id + '/period/' + period.id, function (err, data) {
            var result = JSON.parse(data);
            test.ok(result);
            test.ok(result.name);
            test.ok(result.date);
            test.equal(result.closed, false);

            test.done();
        });
    });
}

exports['get first project team'] = function (test) {
    test.async();

    api.doRequest('GET', 'http://localhost:3000/api/project/' + project.id + '/team', function (err, data) {
        test.ok(!err);
        test.ok(data);
        var result = JSON.parse(data);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);

        test.ok(sl.exist(result, { name: 'Alice' }));
        test.ok(sl.exist(result, { name: 'Bob' }));
        test.ok(sl.exist(result, { name: 'Charlie' }));

        test.done();
    });
}

exports['add person to team'] = function (test) {
    test.async();

    var pservice = require('../services/person');
    var daniel;

    async()
    .then(function (data, next) {
        pservice.getPersonByName('Daniel', next);
    })
    .then(function (data, next) {
        daniel = data;
        api.doRequest('PUT', 'http://localhost:3000/api/project/' + project.id + '/team/' + daniel.id, next);
    })
    .then(function (data, next) {
        api.doRequest('GET', 'http://localhost:3000/api/project/' + project.id + '/team', next);
    })
    .then(function (data, next) {
        test.ok(data);
        var result = JSON.parse(data);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);

        test.ok(sl.exist(result, { name: 'Alice' }));
        test.ok(sl.exist(result, { name: 'Bob' }));
        test.ok(sl.exist(result, { name: 'Charlie' }));
        test.ok(sl.exist(result, { name: 'Daniel' }));

        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['stop server'] = function (test) {
    server.close();
}
