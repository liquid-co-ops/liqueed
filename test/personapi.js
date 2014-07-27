'use strict';

var controller = require('../controllers/personapi');

var loaddata = require('../utils/loaddata');
var db = require('../utils/db');

var persons;

exports['clear and load data'] = function (test) {
    var personService = require('../services/person');

    db.clear();
    loaddata();
    
    persons = personService.getPersons();
    
    test.ok(persons);
    test.ok(persons.length);
};

exports['get persons'] = function (test) {
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
