var app = require('../app');
var api = require('./utils/api');
var ajax = require('./utils/ajax');
var async = require('simpleasync');

ajax.setPrefix('http://localhost:3000');

var client = require('../public/scripts/clientserver');

var projects;
var team;
var periods;
var persons;

exports['load test data'] = function (test) {
    test.async();
    
    var loaddata = require('../utils/loaddata');
    loaddata(function (err, result) {
        test.ok(!err);
        test.done();
    });
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
        test.ok(result.length);
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
    
    client.getSharesByProject(projects[0].id, function (err, result) {
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
            test.ok(item.username);
        });
        
        persons = result;
        
        test.done();
    });
}

exports['login person'] = function (test) {
    test.async();
    
    client.loginPerson(persons[0].username, persons[0].username, function (err, result) {
        test.ok(!err);
        test.ok(result);
        
        test.equal(result.id, persons[0].id);
        test.equal(result.name, persons[0].name);
        test.equal(result.username, persons[0].username);
        
        test.done();
    });
}

exports['login unknown person'] = function (test) {
    test.async();
    
    client.loginPerson('foo', 'foo', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.error, 'Unknown username');
        
        test.done();
    });
}

exports['login invalid password'] = function (test) {
    test.async();
    
    client.loginPerson(persons[0].username, 'foo', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.error, 'Invalid password');
        
        test.done();
    });
}

exports['add project'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { client.addProject({ name: 'New Project' }, next); })
    .then(function (data, next) {
        test.ok(data);
        client.getProject(data, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(data.id);
        test.ok(data.name);
        test.equal(data.name, 'New Project');
        test.done();
    })
    .fail(function (err) {
        console.log(err);
        throw err;
    })
    .run();
}

exports['stop server'] = function (test) {
    server.close();
}

