'use strict';

var fs = require('fs');
var async = require('simpleasync');
var sl = require('simplelists');
var personservice = require('../../services/person');
var projectservice = require('../../services/project');

function doAssign(cmd, cb) {
    var projectname = cmd.args[0];
    var periodname = cmd.args[1];
    var fromname = cmd.args[2];
    var toname = cmd.args[3];
    var amount = parseInt(cmd.args[4]);
    var note = cmd.args[5];
    
    var project;
    var period;
    var from;
    var to;
    
    async()
    .then(function (data, next) { projectservice.getProjectByName(projectname, next); })
    .then(function (data, next) {
        project = data;
        projectservice.getPeriodByName(project.id, periodname, next);
    })
    .then(function (data, next) {
        period = data;
        personservice.getPersonByName(fromname, next);
    })
    .then(function (data, next) {
        from = data;
        personservice.getPersonByName(toname, next);
    })
    .then(function (data, next) {
        to = data;
        projectservice.putAssignment(project.id, period.id, from.id, to.id, amount, note, next);
    })
    .then(function (data, next) {
        cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

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

function doDistributionOpened(cmd, cb) {
    var projname = cmd.args[0];
    var name = cmd.args[1];
    var project;
    
    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        project = data;
        
        projectservice.getPeriodByName(project.id, name, next);
    })
    .then(function (data, next) {
        if (!data) {
            cb('Distribution ' + name + " does not exist", null);
            return;
        }
        
        if (data.closed) {
            cb('Distribution ' + name + " is closed", null);
            return;
        }
        
        cb(null, null); 
    })
    .fail(function (err) { cb(err, null); })
    .run();
}

function doDistributionClosed(cmd, cb) {
    var projname = cmd.args[0];
    var name = cmd.args[1];
    var project;
    
    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        project = data;
        
        projectservice.getPeriodByName(project.id, name, next);
    })
    .then(function (data, next) {
        if (!data) {
            cb('Distribution ' + name + " does not exist", null);
            return;
        }
        
        if (!data.closed) {
            cb('Distribution ' + name + " is still opened", null);
            return;
        }
        
        cb(null, null); 
    })
    .fail(function (err) { cb(err, null); })
    .run();
}

function doPoints(cmd, options, cb) {
    var projname = cmd.args[0];
    var expected = cmd.args[1];

    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        projectservice.getTotalSharesByProject(data.id, options, next);
    })
    .then(function (data, next) {
        if (data != expected)
            cb('Project ' + projname + ' points are ' + data + ', not ' + expected, null);
        else
            cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function doPersonPoints(cmd, options, cb) {
    var projname = cmd.args[0];
    var personname = cmd.args[1];
    var expected = cmd.args[2];

    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        projectservice.getSharesByProject(data.id, options, next);
    })
    .then(function (data, next) {
        if (expected == 0)
            if (sl.exist(data, { name: personname }))
                cb('Person ' + personname + ' points are not ' + expected, null);
            else
                cb(null, null);
        else
            if (!sl.exist(data, { name: personname, shares: expected }))
                cb('Person ' + personname + ' points are not ' + expected, null);
            else
                cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function doTeamAdd(cmd, cb) {
    var projname = cmd.args[0];
    var personname = cmd.args[1];
    var project;
    var person;

    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        project = data;
        personservice.getPersonByName(personname, next);
    })
    .then(function (data, next) {
        person = data;
        projectservice.addPersonToTeam(project.id, person.id, next);
    })
    .then(function (data, next) {
        cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function doTeamRemove(cmd, cb) {
    var projname = cmd.args[0];
    var personname = cmd.args[1];
    var project;
    var person;

    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        project = data;
        personservice.getPersonByName(personname, next);
    })
    .then(function (data, next) {
        person = data;
        projectservice.removePersonFromTeam(project.id, person.id, next);
    })
    .then(function (data, next) {
        cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function doTeamMember(cmd, cb, negate) {
    var projname = cmd.args[0];
    var personname = cmd.args[1];
    var project;

    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        project = data;
        projectservice.getTeam(project.id, next);
    })
    .then(function (data, next) {
        if (!sl.exist(data, { name: personname }))
            if (negate)
                cb(null, null);
            else
                cb('Person ' + personname + ' is not a team member of ' + projname + ' project', null);
        else
            if (negate)
                cb('Person ' + personname + ' is a team member of ' + projname + ' project', null);
            else
                cb(null, null);
    })
    .fail(function (err) {
        cb(err, null);
    })
    .run();
}

function doShareholder(cmd, cb) {
    var projname = cmd.args[0];
    var personname = cmd.args[1];
    var project;

    async()
    .then(function (data, next) { projectservice.getProjectByName(projname, next); })
    .then(function (data, next) {
        project = data;
        projectservice.getShareholders(project.id, next);
    })
    .then(function (data, next) {
        if (!sl.exist(data, { name: personname }))
            cb('Person ' + personname + ' is not a ' + projname + ' shareholder', null);
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

function execute(cmd, options, cb) {
    if (!cb) {
        cb = options;
        options = null;
    }
    
    options = options || {};
    
    function doCommand() {
        if (cmd.length == 0) {
            cb(null, null);
            return;
        }

        var scmd = cmd.shift();

        execute(scmd, options, function (err, data) {
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
        return execute(cmd.split('\n'), options, cb);

    var p = cmd.indexOf('#');

    if (p >= 0)
        cmd = cmd.substring(0, p).trim();
        
    cmd = cmd.trim();

    if (cmd.length == 0) {
        cb(null, null);
        return;
    }

    if (options.verbose)
        console.log(cmd);

    cmd = parse(cmd);

    if (cmd.verb == 'person_new')
        doPersonNew(cmd, cb);
    else if (cmd.verb == 'project_new')
        doProjectNew(cmd, cb);
    else if (cmd.verb == 'distribution_new')
        doDistributionNew(cmd, cb);
    else if (cmd.verb == 'distribution_opened')
        doDistributionOpened(cmd, cb);
    else if (cmd.verb == 'distribution_closed')
        doDistributionClosed(cmd, cb);
    else if (cmd.verb == 'team_add')
        doTeamAdd(cmd, cb);
    else if (cmd.verb == 'team_remove')
        doTeamRemove(cmd, cb);
    else if (cmd.verb == 'team_member')
        doTeamMember(cmd, cb);
    else if (cmd.verb == '!team_member')
        doTeamMember(cmd, cb, true);
    else if (cmd.verb == 'shareholder')
        doShareholder(cmd, cb);
    else if (cmd.verb == 'points')
        if (cmd.args.length == 2)
            doPoints(cmd, { }, cb);
        else
            doPersonPoints(cmd, { }, cb);
    else if (cmd.verb == 'closedpoints')
        if (cmd.args.length == 2)
            doPoints(cmd, { closed: true }, cb);
        else
            doPersonPoints(cmd, { closed: true }, cb);
    else if (cmd.verb == 'assign')
        doAssign(cmd, cb);
    else
        cb("Unknown verb '" + cmd.verb + "'", null);
}

function executeFile(filename, options, cb) {
    return execute(fs.readFileSync(filename).toString(), options, cb);
}

module.exports = {
    execute: execute,
    executeFile: executeFile
}
