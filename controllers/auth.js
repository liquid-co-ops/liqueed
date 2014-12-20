'use strict';

var service = require('../services/person');
var async = require('simpleasync');

function signIn(req, res) {
    res.render('signin', { title: 'Sign In' });
}

module.exports = {
    signIn: signIn
};