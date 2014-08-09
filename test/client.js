
var client = require('../public/scripts/client.js');

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
        test.equal(result.length, 0);
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
        test.done();
    });
}


