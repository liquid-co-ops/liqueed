
var dsl = require('./libs/dsl');
var async = require('simpleasync');
var db = require('../utils/db');
var path = require('path');

exports['no shares'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        var filename = path.join(__dirname, 'dslfiles', 'noshares.txt');
        console.log();
        console.log('noshares.txt');
        dsl.executeFile(filename, { verbose: true }, next);
    })
    .then(function (data, next) {
        test.done();
    })
    .run();
}