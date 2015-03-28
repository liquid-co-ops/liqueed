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

