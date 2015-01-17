var Browser = require('zombie');
var assert  = require('assert');
var async = require('simpleasync');
var loaddata = require('../utils/loaddata');
var app = require('../app');

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
        // We call our test example.com
        Browser.localhost('localhost', 3000);

        // Load the page from localhost
        browser = Browser.create();
        browser.visit('/', next);
    })
    .then(function (data, next) {
        browser.assert.element('#signinpage');
        browser.fill('#login_username', 'alice')
            .fill('#login_password', 'alice')
            .pressButton('Sign In', next);
    })
    .then(function (data, next) {
        browser.assert.success();
        browser.assert.style("#projectspage", "display", "");
        next(null, null);
    })
    .then(function (data, next) {
        server.close();
    })
    .fail(function (err) {
        throw err;
    })
    .run();
    
