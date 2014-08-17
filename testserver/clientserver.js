var app = require('../app');
var api = require('./utils/api');
var ajax = require('./utils/ajax');

ajax.setPrefix('http://localhost:3000');

var client = require('../public/scripts/clientserver');

exports['load test data'] = function (test) {
    var loaddata = require('../utils/loaddata');
    loaddata();
}

exports['start server'] = function (test) {
    server = app.listen(3000);
}

exports['get my projects'] = function (test) {
    test.async();
    
    client.getMyProjects(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
}

exports['get first project'] = function (test) {
    test.async();
    
    client.getProject(1, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(result.id);
        test.ok(result.name);
        test.equal(result.id, 1);
        test.done();
    });
}

exports['get periods from first project'] = function (test) {
    test.async();
    
    client.getPeriods(1, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
}

exports['get periods from second project'] = function (test) {
    test.async();
    
    client.getPeriods(2, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 2);
        test.done();
    });
}

exports['get shareholders from first project'] = function (test) {
    test.async();
    
    client.getShareholders(1, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        
        for (var n in result) {
            var item = result[n];
            test.ok(item.id);
            test.ok(item.name);
        }
        
        test.done();
    });
}

exports['get shares from first project'] = function (test) {
    test.async();
    
    client.getShares(1, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        
        for (var n in result) {
            var item = result[n];
            test.ok(item.id);
            test.ok(item.name);
            test.ok(item.shares != null);
        }
        
        test.done();
    });
}

exports['stop server'] = function (test) {
    server.close();
}

