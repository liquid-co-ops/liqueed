'use strict';

var service = require('../services/dcategory');
var async = require('simpleasync');

var catid;

exports['add category'] = function (test) {
    test.async();

    service.addCategory({ name: 'Marketing' }, function (err, result) {
        test.ok(!err);
        test.ok(result);
        catid = result;
        test.done();
    });
};

exports['get category by id'] = function (test) {
    test.async();

    service.getCategoryById(catid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Marketing');
        test.done();
    });
};

exports['get categories'] = function (test) {
    test.async();

    service.getCategories(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
};

