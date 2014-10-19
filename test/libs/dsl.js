'use strict';

var async = require('simpleasync');
var personservice = require('../../services/person');
var projectservice = require('../../services/project');

function doPersonNew(cmd, cb) {
    personservice.addPerson({ name: cmd.args[0] }, cb);
}

function doProjectNew(cmd, cb) {
    projectservice.addProject({ name: cmd.args[0] }, cb);
}

function doDistributionNew(cmd, cb) {
    var projname = cmd.args[0];
    var name = cmd.args[1];
    var amount = parseInt(cmd.args[2]);
    var date = cmd.args[3];
    
    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        var distribution = {
            name: name,
            amount: amount,
            date: date
        };
        
        projectservice.addPeriod(data.id, distribution, next);
    })
    .then(function (data, next) { cb(null, null); })
    .fail(function (err) { cb(err, null); })
    .run();
}

function doShares(cmd, cb) {
    var projname = cmd.args[0];
    var expected = cmd.args[1];

    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        projectservice.getTotalSharesByProject(data.id, next);
    })
    .then(function (data, next) {
        if (data != expected)
            cb('Project ' + projname + ' shares are ' + data + ', not ' + expected, null);
        else
            cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function parse(cmdtext) {
    cmdtext = cmdtext.trim();
    var p = cmdtext.indexOf(' ');
    
    var verb;
    var args;
    
    if (p >= 0) {
        verb = cmdtext.substring(0, p).trim();
        args = cmdtext.substring(p + 1).trim();
    }
    else
        verb = cmdtext.trim();

    var cmd = { };

    cmd.verb = verb;
    cmd.args = [];

    if (args)
        args.trim().split(';').forEach(function (arg) {
            cmd.args.push(arg.trim());
        });

    return cmd;
}

function execute(cmd, cb) {
    function doCommand() {
        if (cmd.length == 0) {
            cb(null, null);
            return;
        }

        var scmd = cmd.shift();

        execute(scmd, function (err, data) {
            if (err)
                cb(err, null);
            else
                doCommand();
        });
    }
    
    if (Array.isArray(cmd)) {
        doCommand();


        return;
    }

    if (cmd.indexOf('\n') >= 0)
        return execute(cmd.split('\n'), cb);

    var p = cmd.indexOf('#');

    if (p >= 0)
        cmd = cmd.substring(0, p).trim();

    if (cmd.length == 0) {
        cb(null, null);
        return;
    }

    cmd = parse(cmd);

    if (cmd.verb == 'person_new')
        doPersonNew(cmd, cb);
    else if (cmd.verb == 'project_new')
        doProjectNew(cmd, cb);
    else if (cmd.verb == 'distribution_new')
        doDistributionNew(cmd, cb);
    else if (cmd.verb == 'shares')
        doShares(cmd, cb);
    else
        cb("Unknown verb '" + cmd.verb + "'", null);
}

module.exports = {
    execute: execute
}
