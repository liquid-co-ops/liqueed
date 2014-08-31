'use strict';

var controller = require('../controllers/person');

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
    test.async();
    
    var personService = require('../services/person');
    
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

exports['get index'] = function (test) {
    test.async();
    
    var request = {};
    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'personlist');
            test.ok(model);
            test.equal(model.title, 'People');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].id);
            test.ok(model.items[0].name);
            test.done();
        }
    };
    
    controller.index(request, response);
};

exports['get view first person'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: persons[0].id
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'personview');
            test.ok(model);
            test.equal(model.title, 'Person');
            test.ok(model.item);
            test.equal(model.item.id, persons[0].id);
            test.equal(model.item.name, persons[0].name);
            test.ok(model.projects);
            test.ok(Array.isArray(model.projects));
            test.ok(model.projects.length);
            test.done();
        }
    };
    
    controller.view(request, response);
};

exports['close db'] = function (test) {
    test.async();
    
    db.closeDb(function (err, data) {
        test.ok(!err);
        test.ok(!data);
        test.done();
    });
}
