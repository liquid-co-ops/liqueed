'use strict';

var service = require('../services/person');
var pservice = require('../services/project');
var async = require('simpleasync');

var annaid;
var lauraid;

exports['add person'] = function (test) {
    test.async();

    service.addPerson({ name: 'Anna' }, function (err, result) {
        test.ok(!err);
        test.ok(result);
        annaid = result;
        test.done();
    });
};

exports['get person by id'] = function (test) {
    test.async();

    service.getPersonById(annaid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Anna');
        test.equal(result.id, annaid);
        test.equal(result.username, 'anna');
        test.done();
    });
};

exports['login person'] = function (test) {
    test.async();

    service.loginPerson('anna', 'anna', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Anna');
        test.equal(result.id, annaid);
        test.equal(result.username, 'anna');
        test.done();
    });
};

exports['login unknown person'] = function (test) {
    test.async();

    service.loginPerson('foo', 'foo', function (err, result) {
        test.ok(err);
        test.equal(err, 'Unknown username');
        test.done();
    });
};

exports['login invalid password'] = function (test) {
    test.async();

    service.loginPerson('anna', 'foo', function (err, result) {
        test.ok(err);
        test.equal(err, 'Invalid password');
        test.done();
    });
};

exports['get person by name'] = function (test) {
    test.async();

    service.getPersonByName('Anna', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Anna');
        test.equal(result.id, annaid);
        test.done();
    });
};

exports['get person by username'] = function (test) {
    test.async();

    service.getPersonByUserName('anna', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.username, 'anna');
        test.equal(result.name, 'Anna');
        test.equal(result.id, annaid);
        test.done();
    });
};

exports['add person with username'] = function (test) {
    test.async();

    service.addPerson({ username: 'lingalls', name: 'Laura' }, function (err, result) {
        test.ok(!err);
        test.ok(result);
        lauraid = result;
        test.done();
    });
};

exports['get person with username by id'] = function (test) {
    test.async();

    service.getPersonById(lauraid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Laura');
        test.equal(result.id, lauraid);
        test.equal(result.username, 'lingalls');
        test.done();
    });
};

exports['get unknown person by name'] = function (test) {
    test.async();

    service.getPersonByName('FooMan', function (err, result) {
        test.ok(!err);
        test.equal(result, null);
        test.done();
    });
};

exports['get persons'] = function (test) {
    test.async();

    service.getPersons(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
};

exports['normalize and get persons'] = function (test) {
    test.async();

    async()
    .then(function (data, next) {
        service.normalizePersons(next);
    })
    .then(function (data, next) {
        service.getPersons(next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);

        result.forEach(function (item) {
            test.ok(item.id);
            test.ok(item.name);
            test.ok(item.username);
        });

        test.done();
    })
    .run();
};

exports['no projects yet'] = function (test) {
    test.async();

    service.getProjects(annaid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });
};

exports['add and get projects'] = function (test) {
    test.async();

    pservice.addProject({ name: 'Wonderland' }, function (err, projid) {
        test.ok(!err);
        test.ok(projid);

        pservice.addPersonToTeam(projid, annaid, function (err, pid) {
            test.ok(!err);
            test.ok(pid);

            service.getProjects(annaid, function (err, result) {
                test.ok(!err);
                test.ok(result);
                test.ok(Array.isArray(result));
                test.equal(result.length, 1);

                test.equal(result[0].id, projid);
                test.equal(result[0].name, 'Wonderland');
                test.done();
            });
        });
    });
}
