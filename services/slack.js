
var personservice = require('./person');
var projectservice = require('./project');

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
    
    if (words && words.length && words[0] && words[1] == 'status') {
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
                
                console.dir(data);
                
                var result = { };
                
                data.forEach(function (item) {
                    result[item.id] = item.shares;
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

module.exports = {
    doTest: doTest,
    doPerson: doPerson,
    doProject: doProject
}


