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

exports['add vote and get decision votes'] = function (test) {
    test.async();
    var userid = 1;
    var voteid;

    async()
    .then(function (data, next) {
        service.addDecisionVote(decid, userid, 1, next);
    })
    .then(function (data, next) {
        test.ok(data);
        voteid = data;
        service.getDecisionVotes(decid, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 1);
        test.equal(data[0].id, voteid);        
        test.equal(data[0].decision, decid);
        test.equal(data[0].user, userid);
        test.equal(data[0].value, 1);
        test.done();
    })
    .run();
};

