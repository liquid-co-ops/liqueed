'use strict';

var dsl = require('./libs/dsl');
var async = require('simpleasync');
var db = require('../utils/db');
var personservice = require('../services/person');

exports['execute new person'] = function (test) {
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
exports['execute new person'] = function (test) {
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

