
var service = require('../services/person');
var pservice = require('../services/project');

var annaid;

exports['add person'] = function (test) {
    test.async();
    
    service.addPerson({ name: 'Anna' }, function (err, result) {
        test.ok(!err);
        test.ok(result);
        annaid = result;
        test.done();
    });    
};

exports['get person by id'] = function (test) {
    test.async();
    
    service.getPersonById(annaid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Anna');
        test.equal(result.id, annaid);
        test.done();
    });    
};

exports['get person by name'] = function (test) {
    test.async();
    
    service.getPersonByName('Anna', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Anna');
        test.equal(result.id, annaid);
        test.done();
    });    
};

exports['get unknown person by name'] = function (test) {
    test.async();
    
    service.getPersonByName('FooMan', function (err, result) {
        test.ok(!err);
        test.equal(result, null);
        test.done();
    });    
};

exports['get persons'] = function (test) {
    test.async();
    
    service.getPersons(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
};

exports['no projects yet'] = function (test) {
    test.async();
    
    service.getProjects(annaid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });    
};

exports['add and get projects'] = function (test) {
    test.async();
    
    pservice.addProject({ name: 'Wonderland' }, function (err, projid) {
        test.ok(!err);
        test.ok(projid);
        
        pservice.addPersonToTeam(projid, annaid, function (err, pid) {
            test.ok(!err);
            test.ok(pid);
            
            service.getProjects(annaid, function (err, result) {
                test.ok(!err);
                test.ok(result);
                test.ok(Array.isArray(result));
                test.equal(result.length, 1);
                
                test.equal(result[0].id, projid);
                test.equal(result[0].name, 'Wonderland');
                test.done();
            });
        });        
    });
}

