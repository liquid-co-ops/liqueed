'use strict';

var service = require('../services/person');
var async = require('simpleasync');

function home(req, res) {
    res.render('home', { title: 'Liqueed' });
}

module.exports = {
    home: home
};