'use strict';

var controller = require('../controllers/slackapi');

var async = require('simpleasync');

exports['do test using query'] = function (test) {
    test.async();
    
    var request = {
        query: {
            name: 'Adam',
            age: 800
        }
    };
    
    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.name, 'Adam');
            test.equal(model.age, 800);
            test.done();
        }
    };
    
    controller.doTest(request, response);
};

exports['do test using body'] = function (test) {
    test.async();
    
    var request = {
        body: {
            name: 'Adam',
            age: 800
        }
    };
    
    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.name, 'Adam');
            test.equal(model.age, 800);
            test.done();
        }
    };
    
    controller.doTest(request, response);
};

