
var personservice = require('./person');

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

module.exports = {
    doTest: doTest,
    doPerson: doPerson
}

