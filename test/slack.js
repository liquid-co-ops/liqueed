'use strict';

var service = require('../services/slack');
var async = require('simpleasync');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');

var persons;

exports['clear and load data'] = function (test) {
    var personService = require('../services/person');

    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { personService.getPersons(next); })
    .then(function (data, next) {
        persons = data;
        test.ok(persons);
        test.ok(persons.length);
        test.done();
    })
    .run();
};

exports['do test'] = function (test) {
    var result = service.doTest({ name: 'Adam', age: 800 });
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.name, 'Adam');
    test.equal(result.age, 800);
}

exports['do person'] = function (test) {
    test.async();
    
    service.doPerson(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.equal(result.length, persons.length);
        
        persons.forEach(function (person) {
            test.ok(result.indexOf(person.username) >= 0);
        });
        
        test.done();
    });
}
