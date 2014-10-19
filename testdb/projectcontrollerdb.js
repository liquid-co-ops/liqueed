'use strict';

var controller = require('../controllers/project');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');

var projects;

exports['use db'] = function (test) {
    test.async();

    db.useDb('liqueed-test', null, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
}

var projectcontroller = require('../test/projectcontroller');

for (var n in projectcontroller)
    exports[n] = projectcontroller[n];

exports['close db'] = function (test) {
    test.async();

    db.closeDb(function (err, data) {
        test.ok(!err);
        test.ok(!data);
        test.done();
    });
}
