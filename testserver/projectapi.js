
var app = require('../app');
var api = require('./utils/api');

var server;
var projects;

exports['load test data'] = function (test) {
    var loaddata = require('../utils/loaddata');
    loaddata();
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
        console.dir(result);
        projects = result;
        test.done();
    });
}

exports['get first project'] = function (test) {
    test.async();
    
    api.doRequest('GET', 'http://localhost:3000/api/project/' + projects[0].id, function (err, data) {
        test.ok(!err);
        test.ok(data);
        var result = JSON.parse(data);
        test.ok(result);
        
        test.equal(result.id, projects[0].id);
        test.equal(result.name, projects[0].name);
        
        console.dir(result);
        test.done();
    });
}

exports['stop server'] = function (test) {
    server.close();
}
