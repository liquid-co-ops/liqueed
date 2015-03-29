'use strict';

var service = require('../services/dcategory');
var async = require('simpleasync');
var sl = require('simplelists');

var catid;

exports['add category'] = function (test) {
    test.async();

    service.addCategory(1, { name: 'Marketing' }, function (err, result) {
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

exports['get categories by project'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.getCategoriesByProject(1, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.ok(data.length);
        test.ok(sl.exist(data, { project: 1 }));
        test.ok(sl.exist(data, { name: 'Marketing' }));
        test.done();
    })
    .run();
};

