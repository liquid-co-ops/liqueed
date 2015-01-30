var Browser = require('zombie');
var assert  = require('assert');
var async = require('simpleasync');
var loaddata = require('../utils/loaddata');
var app = require('../app');
var zdsl = require('../test/libs/zdsl');

var server;
var browser;

var options = { verbose: true }

async()
    .then(function (data, next) {
        loaddata(next);        
    })
    .then(function (data, next) {
        server = app.listen(3000);
        next(null, null);
    })
    .then(function (data, next) {
        zdsl.localhost('localhost', 3000);
        zdsl.execute('visit /', options, next);
    })
    .then(function (data, next) {
        zdsl.execute('fill #login_username;alice', options, next);
    })
    .then(function (data, next) {
        zdsl.execute('fill #login_password;alice', options, next);
    })
    .then(function (data, next) {
        zdsl.execute('click Sign In', options, next);
    })
    .then(function (data, next) {
        zdsl.execute('visible #projectspage', options, next);
    })
    .then(function (data, next) {
        zdsl.execute('click GitBook', options, next);
    })
    .then(function (data, next) {
        zdsl.execute('click March 2014', options, next);
    })
    .then(function (data, next) {
        server.close();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
    
