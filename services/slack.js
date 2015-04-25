
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

function doProject(cb) {
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


