
var personservice = require('./person');
var projectservice = require('./project');
var kudoservice = require('./kudo');
var async = require('simpleasync');

function doTest(params) {
    return params;
}

function doPerson(cb) {
    personservice.getPersons(function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var result = [];
        
        data.forEach(function (person) {
            result.push(person.username);
        });
        
        cb(null, result);
    });
}

function doProject(words, cb) {
    if (!cb) {
        cb = words;
        words = [];
    }
    
    if (words && words.length && words[0] && words[1] == 'points') {
        projectservice.getProjectByName(words[0], function (err, project) {
            if (err) {
                cb(err, null);
                return;
            }
            
            projectservice.getSharesByProject(project.id, function (err, data) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                var result = { };
                
                data.forEach(function (item) {
                    result[item.username] = item.shares;
                });
                
                cb(null, result);
            });
        });
        
        return;
    }

    projectservice.getProjects(function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        var result = [];
        
        data.forEach(function (project) {
            result.push(project.name);
        });
        
        cb(null, result);
    });
}

function doKudoSend(words, cb) {
    var from;
    var to;
    
    async()
    .then(function (data, next) {
        personservice.getPersonByUserName(words[0], next);
    })
    .then(function (data, next) {
        from = data;
        personservice.getPersonByUserName(words[1], next);
    })    
    .then(function (data, next) {
        to = data;
        kudoservice.sendKudo(from.id, to.id, cb);
    })
    .run();
}

function doKudoReceived(words, cb) {
    async()
    .then(function (data, next) {
        personservice.getPersonByUserName(words[0], next);
    })
    .then(function (data, next) {
        kudoservice.getReceivedKudos(data.id, cb);
    })
    .run();
}

function doKudo(words, cb) {
    if (words.length > 1)
        doKudoSend(words, cb);
    else
        doKudoReceived(words, cb);
}
 
module.exports = {
    doTest: doTest,
    doPerson: doPerson,
    doProject: doProject,
    doKudo: doKudo
}


