
var service = require('../services/person');
var pservice = require('../services/project');

var db = require('../utils/db');

var aliceid;

exports['use db'] = function (test) {
    test.async();
    
    db.useDb('liqueed-test', null, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
}

exports['add person'] = function (test) {
    test.async();
    
    service.addPerson({ name: 'Alice' }, function (err, result) {
        test.ok(!err);
        test.ok(result);
        aliceid = result;
        test.done();
    });    
};

exports['get person by id'] = function (test) {
    test.async();
    
    service.getPersonById(aliceid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'Alice');
        test.equal(result.id, aliceid);
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
    
    service.getProjects(aliceid, function (err, result) {
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
        
        pservice.addPersonToTeam(projid, aliceid, function (err, pid) {
            test.ok(!err);
            test.ok(pid);
            
            service.getProjects(aliceid, function (err, result) {
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

exports['close db'] = function (test) {
    test.async();
    
    db.closeDb(function (err, data) {
        test.ok(!err);
        test.ok(!data);
        test.done();
    });
}
