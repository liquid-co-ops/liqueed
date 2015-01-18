var Browser = require('zombie');
var assert  = require('assert');
var async = require('simpleasync');
var loaddata = require('../utils/loaddata');
var app = require('../app');
var zdsl = require('./zdsl');

var server;
var browser;

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
        zdsl.execute('visit /', next);
    })
    .then(function (data, next) {
        zdsl.execute('fill #login_username;alice', next);
    })
    .then(function (data, next) {
        zdsl.execute('fill #login_password;alice', next);
    })
    .then(function (data, next) {
        zdsl.execute('click Sign In', next);
    })
    .then(function (data, next) {
        zdsl.execute('click Sign In', next);
    })
    .then(function (data, next) {
        server.close();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
    
