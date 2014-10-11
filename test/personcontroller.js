'use strict';

var controller = require('../controllers/person');

var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');
var bcrypt = require('bcrypt-nodejs');

var persons;

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
            test.ok(model.items[0].username);
            test.done();
        }
    };
    
    controller.index(request, response);
};

exports['get new person'] = function (test) {
    test.async();
    
    var request = {};

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'personnew');
            test.ok(model);
            test.equal(model.title, 'New Person');
            test.done();
        }
    };
    
    controller.newPerson(request, response);
};

exports['add new person'] = function (test) {
    test.async();
    
    var formdata = {
        name: 'New Person',
        username: 'newperson',
        email: 'newperson@gmail.com',
        password: 'newnew'
    }
    
    var request = {
        param: function (name) {
            return formdata[name];
        }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'personview');
            test.ok(model);
            test.equal(model.title, 'Person');
            test.ok(model.item);
            test.ok(model.item.id);
            test.equal(model.item.username, 'newperson');
            test.equal(model.item.name, 'New Person');
            test.equal(model.item.email, 'newperson@gmail.com');
            test.ok(bcrypt.compareSync('newnew', model.item.password));
            test.done();
        }
    };
    
    controller.addPerson(request, response);
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
