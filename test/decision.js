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

