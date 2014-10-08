
var client = require('../public/scripts/client.js');
var async = require('simpleasync');

var projects;
var project;
var persons;

exports['get my projects'] = function (test) {
    test.async();
    
    client.getMyProjects(function (err, result) {
        test.ok(!err);
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
    
    client.getProject(project.id, function (err, result) {
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
    
    client.getPeriods(project.id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
}

exports['get periods from second project'] = function (test) {
    test.async();
    
    client.getPeriods(projects[1].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });
}

exports['get shareholders from first project'] = function (test) {
    test.async();
    
    client.getShareholders(project.id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
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


