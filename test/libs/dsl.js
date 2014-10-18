
var personservice = require('../../services/person');

function doPersonNew(cmd, cb) {
    personservice.addPerson({ name: cmd.args[0] }, cb);
}

function parse(cmdtext) {
    var words = cmdtext.trim().split(' ');
    
    var cmd = { };
    
    cmd.verb = words[0].trim();
    cmd.args = [];
    
    words[1].trim().split(';').forEach(function (arg) {
        cmd.args.push(arg.trim());
    });
    
    return cmd;
}

function execute(cmd, cb) {
    if (Array.isArray(cmd)) {
        doCommand();
        
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
        
        return;
    }
    
    if (cmd.indexOf('\n') >= 0)
        return execute(cmd.split('\n'), cb);
    
    cmd = parse(cmd);
    
    if (cmd.verb == 'person_new')
        doPersonNew(cmd, cb);
    else
        cb("Unknown verb '" + cmd.verb + "'", null);
}

module.exports = {
    execute: execute
}
