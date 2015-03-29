'use strict';

var service = require('../services/decision');
var async = require('simpleasync');

var decid;

exports['add decision'] = function (test) {
    test.async();

    service.addDecision({ description: 'To be or not to be?' }, function (err, result) {
        test.ok(!err);
        test.ok(result);
        decid = result;
        test.done();
    });
};

exports['get decision by id'] = function (test) {
    test.async();

    service.getDecisionById(decid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.description, 'To be or not to be?');
        test.done();
    });
};

exports['get decisions'] = function (test) {
    test.async();

    service.getDecisions(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
};

exports['get decisions by project'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.addDecision({ description: 'Project Decision', project: 1 }, next);
    })
    .then(function (data, next) {
        service.getDecisionsByProject(1, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.ok(data.length);
        test.done();
    })
    .run();

};
