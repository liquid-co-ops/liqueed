
var zdsl = require('./libs/zdsl');
var async = require('simpleasync');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var path = require('path');
var fs = require('fs');
var app = require('../app');
var pservice = require('../services/person');

var server;
var options = { verbose: true }

exports['start server'] = function (test) {
	test.async();
	
	async()
		.then(function (data, next) {
			db.clear(next);        
		})
		.then(function (data, next) {
			loaddata(next);        
		})
		.then(function (data, next) {
			server = app.listen(3000);
			test.done();
		})
		.run();
}

exports['zdsl files'] = function (test) {
    test.async();
    
    var pathname = path.join(__dirname, 'zdslfiles');
    
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
    .then(function (data, next) {
        var fname = path.join(__dirname, 'zdslfiles', filename);
		zdsl.localhost('localhost', 3000);
        zdsl.executeFile(fname, { verbose: true }, next);
    })
    .then(function (data, next) {
        cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

exports['stop server'] = function (test) {
	server.close();
	test.done();
}

