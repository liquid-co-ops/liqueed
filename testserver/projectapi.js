
var app = require('../app');
var api = require('./utils/api');

var server;
var projects;
var project;
var periods;

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
        project = projects[0];
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
        
        test.done();
    });
}

exports['stop server'] = function (test) {
    server.close();
}
