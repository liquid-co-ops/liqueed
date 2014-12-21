'use strict';

var controller = require('../controllers/auth');

exports['get sign in'] = function (test) {
    test.async();

    var request = {};

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'signin');
            test.ok(model);
            test.equal(model.title, 'Sign In');

            test.done();
        }
    };

    controller.signInForm(request, response);
};

exports['add new project'] = function (test) {
    test.async();

    var formdata = {
        username: 'admin',
        password: 'admin'
    }

    var request = {
        param: function (name) {
            return formdata[name];
        },
        session: { }
    };

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'home');
            test.ok(model);
            test.equal(model.title, 'Liqueed');
            
            test.ok(response.session.user);
            test.equal(response.session.user.username, 'admin');
            
            test.done();
        }
    };

    controller.signIn(request, response);
};

