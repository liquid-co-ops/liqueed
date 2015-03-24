'use strict';

var pages = require('../public/scripts/pages');
var $ = require('simplejquery').$;

exports['Go to sign in'] = function (test) {
    test.async();

    pages.gotoSignIn(function (err, data) {
        test.equal(err, null);

        test.ok(data);
        test.ok(Array.isArray(data));

        test.ok($("#signinpage").$.visible());

        test.done();
    });
}

exports['Go to new project'] = function (test) {
    test.async();

    pages.gotoNewProject(function (err, data) {
        test.equal(err, null);

        test.ok($("#projectnewpage").$.visible());

        test.done();
    });
}
