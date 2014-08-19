var app = require('../app');
var api = require('./utils/api');
var ajax = require('./utils/ajax');

ajax.setPrefix('http://localhost:3000');

var client = require('../public/scripts/clientserver');

var projects;
var team;
var periods;

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
        
        projects = result;
        
        test.done();
    });
}

exports['get first project'] = function (test) {
    test.async();
    
    client.getProject(projects[0].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(result.id);
        test.ok(result.name);
        test.equal(result.id, projects[0].id);
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
        
        periods = result;
        
        test.done();
    });
}

exports['get periods from second project'] = function (test) {
    test.async();
    
    client.getPeriods(projects[1].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, projects[1].id);
        test.done();
    });
}

exports['get shareholders from first project'] = function (test) {
    test.async();
    
    client.getShareholders(projects[0].id, function (err, result) {
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

exports['get team from first project'] = function (test) {
    test.async();
    
    client.getTeam(projects[0].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        
        for (var n in result) {
            var item = result[n];
            test.ok(item.id);
            test.ok(item.name);
        }
        
        team = result;
        
        test.done();
    });
}

exports['get assignments from first project first period'] = function (test) {
    test.async();
    
    client.getAssignments(projects[0].id, periods[0].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        
        for (var n in result) {
            var item = result[n];
            test.ok(item.from);
            test.ok(item.to);
            test.ok(item.amount != null);
        }
        
        test.done();
    });
}

exports['get shares from first project'] = function (test) {
    test.async();
    
    client.getShares(projects[0].id, function (err, result) {
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

exports['put assignments to first project first period from first person'] = function (test) {
    test.async();
    
    client.putAssigments(projects[0].id, periods[0].id, team[0].id, [
            { to: team[1].id, amount: 10 },
            { to: team[2].id, amount: 90 }
        ], 
        function (err, result) {
            test.ok(!err);
            test.ok(result);
            test.strictEqual(result, true);
        
            test.done();
        });
}

exports['get persons'] = function (test) {
    test.async();
    
    client.getPersons(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        
        result.forEach(function (item) {
            test.ok(item.id);
            test.ok(item.name);
        });
        
        test.done();
    });
}

exports['stop server'] = function (test) {
    server.close();
}

