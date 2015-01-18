'use strict';

var fs = require('fs');
var Browser = require('zombie');

var browser;

function doVisit(cmd, cb) {
    browser.visit(cmd.args[0], cb);
}

function doClick(cmd, cb) {
    browser.pressButton(cmd.args[0], cb);
}

function doFill(cmd, cb) {
    try {
        browser.fill(cmd.args[0], cmd.args[1]);
        cb(null, null);
    }
    catch (err) {
        cb(err, null);
    }
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

    var p = cmd.indexOf("'");

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

    if (cmd.verb == 'visit')
        doVisit(cmd, cb);
    else if (cmd.verb == 'fill')
        doFill(cmd, cb);
    else if (cmd.verb == 'click')
        doClick(cmd, cb);
    else
        cb("Unknown verb '" + cmd.verb + "'", null);
}

function executeFile(filename, options, cb) {
    return execute(fs.readFileSync(filename).toString(), options, cb);
}

function localhost(host, port) {
    Browser.localhost(host, port);
    browser = Browser.create();
}

module.exports = {
    localhost: localhost,
    execute: execute,
    executeFile: executeFile
}

