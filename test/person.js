
var service = require('../services/person');
var pservice = require('../services/project');

var aliceid;

exports['add person'] = function (test) {
    var result = service.addPerson({ name: 'Alice' });
    
    test.ok(result);
    aliceid = result;
};

exports['get person by id'] = function (test) {
    var result = service.getPersonById(aliceid);
    
    test.ok(result);
    test.equal(result.name, 'Alice');
    test.equal(result.id, aliceid);
};

exports['get persons'] = function (test) {
    var result = service.getPersons();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.ok(result.length);
};

exports['no projects yet'] = function (test) {
    var result = service.getProjects(aliceid);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['add and get projects'] = function (test) {
    var projid = pservice.addProject({ name: 'Wonderland' });
    pservice.addPersonToTeam(projid, aliceid);
    
    var result = service.getProjects(aliceid);

    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    
    test.equal(result[0].id, projid);
    test.equal(result[0].name, 'Wonderland');
}

