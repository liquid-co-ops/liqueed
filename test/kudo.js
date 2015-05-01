'use strict';

var service = require('../services/kudo');
var async = require('simpleasync');
var db = require('../utils/db');
var loaddata = require('../utils/loaddata');

var projects;
var alice;
var bob;
var charlie;

exports['clear and load data'] = function (test) {
    test.async();

    var projectService = require('../services/project');

    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { projectService.getProjects(next); })
    .then(function (data, next) {
        projects = data;
        test.ok(projects);
        test.ok(projects.length);
        test.done();
    })
    .run();
};

exports['get alice kudos as zero'] = function (test) {
    test.async();
    
    var personService = require('../services/person');
    
    async()
    .then(function (data, next) { personService.getPersonByUserName('alice', next); })
    .then(function (data, next) {
        alice = data;
        service.getReceivedKudos(alice.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 0);
        test.done();
    })
    .run();
}

exports['alice gives kudo to bob'] = function (test) {
    test.async();
    
    var personService = require('../services/person');
    
    async()
    .then(function (data, next) { personService.getPersonByUserName('bob', next); })
    .then(function (data, next) {
        bob = data;
        service.sendKudo(alice.id, bob.id, next);
    })
    .then(function (data, next) {
        service.getReceivedKudos(alice.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 0);
        service.getReceivedKudos(bob.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 1);
        test.done();
    })
    .run();
}

exports['bob gives kudo to charlie'] = function (test) {
    test.async();
    
    var personService = require('../services/person');
    
    async()
    .then(function (data, next) { personService.getPersonByUserName('charlie', next); })
    .then(function (data, next) {
        charlie = data;
        service.sendKudo(bob.id, charlie.id, next);
    })
    .then(function (data, next) {
        service.getReceivedKudos(alice.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 0);
        service.getReceivedKudos(bob.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 1);
        service.getReceivedKudos(charlie.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 1);
        test.done();
    })
    .run();
}

exports['bob gives kudo again to charlie'] = function (test) {
    test.async();
    
    var personService = require('../services/person');
    
    async()
    .then(function (data, next) {
        service.sendKudo(bob.id, charlie.id, next);
    })
    .then(function (data, next) {
        service.getReceivedKudos(alice.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 0);
        service.getReceivedKudos(bob.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 1);
        service.getReceivedKudos(charlie.id, next);
    })
    .then(function (data, next) {
        test.strictEqual(data, 2);
        test.done();
    })
    .run();
}


