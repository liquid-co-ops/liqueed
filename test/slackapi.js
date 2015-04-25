'use strict';

var controller = require('../controllers/slackapi');

var async = require('simpleasync');

exports['do test'] = function (test) {
    test.async();
    
    var request = {
        params: {
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

