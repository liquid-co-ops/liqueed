'use strict';

var service = require('../services/slack');
var async = require('simpleasync');

exports['do test'] = function (test) {
    var result = service.doTest({ name: 'Adam', age: 800 });
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.name, 'Adam');
    test.equal(result.age, 800);
}