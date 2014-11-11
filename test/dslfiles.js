
var dsl = require('./libs/dsl');
var async = require('simpleasync');
var db = require('../utils/db');
var path = require('path');
var fs = require('fs');

exports['dsl files'] = function (test) {
    test.async();
    
    var pathname = path.join(__dirname, 'dslfiles');
    
    fs.readdir(pathname, function (err, filenames) {
        processfiles();
        
        function processfiles() {
            if (!filenames.length) {
                test.done();
                return;
            }
            
            var filename = filenames.shift();
            
            processfile(filename, function (err, data) {
                if (err)
                    console.log(err);
                else
                    setImmediate(processfiles);
            });
        }
    });
}

function processfile(filename, cb) {
    console.log();
    console.log(filename);
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) {
        var fname = path.join(__dirname, 'dslfiles', filename);
        dsl.executeFile(fname, { verbose: true }, next);
    })
    .then(function (data, next) {
        cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}