'use strict';

var controller = require('../controllers/personapi');

var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');

var persons;

exports['use db'] = function (test) {
    test.async();
    
    db.useDb('liqueed-test', null, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
}

exports['clear and load data'] = function (test) {
    var personService = require('../services/person');

    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { personService.getPersons(next); })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 0);
        loaddata(next);
    })
    .then(function (data, next) { personService.getPersons(next); })
    .then(function (data, next) {
        persons = data;
        test.ok(persons);
        test.ok(persons.length);
        test.done();
    })
    .run();
};

exports['get persons'] = function (test) {
    test.async();
    
    var request = {};
    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.ok(model[0].id);
            test.ok(model[0].name);
            test.done();
        }
    };
    
    controller.list(request, response);
};

exports['get first person'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: persons[0].id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.id, persons[0].id);
            test.equal(model.name, persons[0].name);
            test.done();
        }
    };
    
    controller.get(request, response);
};

exports['get first person projects'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: persons[0].id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            
            test.ok(model[0].id);
            test.ok(model[0].name);
            
            test.done();
        }
    };
    
    controller.getProjects(request, response);
};

exports['close db'] = function (test) {
    test.async();
    
    db.closeDb(function (err, data) {
        test.ok(!err);
        test.ok(!data);
        test.done();
    });
}
