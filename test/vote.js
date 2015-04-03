'use strict';

var service = require('../services/decision');
var async = require('simpleasync');
var sl = require('simplelists');

var decid;

exports['add decision to project'] = function (test) {
    test.async();

    service.addDecision(1, { description: 'Decision to Vote' }, function (err, result) {
        test.ok(!err);
        test.ok(result);
        decid = result;
        test.done();
    });
};

exports['get decision votes as empty array'] = function (test) {
    test.async();

    service.getDecisionVotes(decid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });
};

