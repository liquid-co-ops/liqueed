'use strict';

var service = require('../services/person');
var async = require('simpleasync');

function signInForm(req, res) {
    res.render('signin', { title: 'Sign In' });
}

function signIn(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    
    service.getPersonByUserName('admin', function (err, data) {
        if (err)
            return signInFailed(req, res);

        if (data == null)
            return signInAdmin(req, res, username, password);
            
        service.loginPerson(username, password, function (err, data) {
            if (err)
                return signInFailed(req, res);
                
            req.session.user = { username: username };
            res.render('home', { title: 'Liqueed' });
        });
    });
}
 
function signInAdmin(req, res, username, password) { 
    if (username == 'admin' && password == 'admin') {
        req.session.user = { username: username };
        res.render('home', { title: 'Liqueed' });
    }
    else
        res.render('signin', { title: 'Sign In' });
}

function signInFailed(req, res) {
    res.render('signin', { title: 'Sign In' });
}

module.exports = {
    signInForm: signInForm,
    signIn: signIn
};