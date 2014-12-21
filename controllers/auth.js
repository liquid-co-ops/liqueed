'use strict';

var service = require('../services/person');
var async = require('simpleasync');

function signInForm(req, res) {
    res.render('signin', { title: 'Sign In' });
}

function signIn(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    
    if (username == 'admin' && password == 'admin') {
        res.session.user = { username: username };
        res.render('home', { title: 'Liqueed' });
    }
    else
        res.render('signin', { title: 'Sign In' });
}

module.exports = {
    signInForm: signInForm,
    signIn: signIn
};