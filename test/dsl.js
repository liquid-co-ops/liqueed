'use strict';

var dsl = require('./libs/dsl');
var async = require('simpleasync');
var db = require('../utils/db');
var personservice = require('../services/person');
var projectservice = require('../services/project');
var sl = require('simplelists');

exports['execute new person'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute('person_new Adam', { verbose: true }, next);
    })
    .then(function (data, next) {
        personservice.getPersonByName('Adam', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Adam');
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['execute new person with line comment'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute('person_new Adam # this is a comment', next);
    })
    .then(function (data, next) {
        personservice.getPersonByName('Adam', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Adam');
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['skip comment'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        dsl.execute('# this is a comment', next);
    })
    .then(function (data, next) {
        test.equal(data, null);
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['execute new person with spaces'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute('person_new Adam', next);
    })
    .then(function (data, next) {
        personservice.getPersonByName('Adam', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Adam');
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['execute two new persons'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute(['person_new Adam', 'person_new Eve'], next);
    })
    .then(function (data, next) {
        personservice.getPersonByName('Adam', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Adam');
        personservice.getPersonByName('Eve', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Eve');
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['execute two new persons as line text'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute(['person_new Adam\r\nperson_new Eve'], next);
    })
    .then(function (data, next) {
        personservice.getPersonByName('Adam', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Adam');
        personservice.getPersonByName('Eve', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Eve');
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['execute new project'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute('project_new Paradise', next);
    })
    .then(function (data, next) {
        projectservice.getProjectByName('Paradise', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.name, 'Paradise');
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['execute new distribution'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute(['project_new Paradise', 'distribution_new Paradise;Genesis 1;100;2014-01-31'], next);
    })
    .then(function (data, next) {
        projectservice.getProjectByName('Paradise', next);
    })
    .then(function (data, next) {
        projectservice.getPeriods(data.id, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 1);
        test.ok(data[0].id);
        test.equal(data[0].name, 'Genesis 1');
        test.equal(data[0].amount, 100);
        test.equal(data[0].date, '2014-01-31');
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['execute assign'] = function (test) {
    test.async();
    
    var projectid;
    var periodid;
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute([
            'person_new Adam',
            'person_new Eve',
            'project_new Paradise', 
            'distribution_new Paradise;Genesis 1;100;2014-01-31',
            'assign Paradise;Genesis 1;Adam;Eve;50;Note',
            'shares Paradise;Adam;0',
            'shares Paradise;Eve;50'
        ], next);
    })
    .then(function (data, next) {
        projectservice.getProjectByName('Paradise', next);
    })
    .then(function (data, next) {
        projectid = data.id;
        projectservice.getPeriods(projectid, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 1);
        periodid = data[0].id;
        projectservice.getAssignments(periodid, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 1);
        
        test.equal(data[0].project, projectid);
        test.equal(data[0].period, periodid);
        test.ok(data[0].from);
        test.equal(data[0].from.name, 'Adam');
        test.ok(data[0].to);
        test.equal(data[0].to.name, 'Eve');
        test.equal(data[0].amount, 50);
        test.equal(data[0].note, 'Note');
        
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['unknown verb'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        dsl.execute('foo', next);
    })
    .fail(function (err) {
        test.equal(err, "Unknown verb 'foo'");
        test.done();
    })
    .run();
}

exports['new project shares are zero'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute(['project_new Paradise', 'shares Paradise;0'], next);
    })
    .then(function (data, next) {
        test.equal(data, null);
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['new project shares are not ten'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute(['project_new Paradise', 'shares Paradise;10'], next);
    })
    .fail(function (err) {
        test.equal(err, "Project Paradise shares are 0, not 10");
        test.done();
    })
    .run();
}

exports['unknown project shares'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute(['project_new Paradise', 'shares Paradise;0'], next);
    })
    .then(function (data, next) {
        test.equal(data, null);
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}

exports['add person to team'] = function (test) {
    test.async();
    
    var projectid;
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        dsl.execute(['project_new Paradise', 'person_new Adam', 'team_add Paradise;Adam'], next);
    })
    .then(function (data, next) {
        test.equal(data, null);
        projectservice.getProjectByName('Paradise', next);
    })
    .then(function (data, next) {
        projectid = data.id;
        projectservice.getTeam(projectid, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.ok(sl.exist(data, { name: 'Adam' }));
        test.done();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
}


