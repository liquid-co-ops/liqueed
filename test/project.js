
var service = require('../services/project');
var sperson = require('../services/person');

var liqueedid;
var periodid;

exports['add project'] = function (test) {
    var result = service.addProject({ name: 'liqueed' });
    
    test.ok(result);
    liqueedid = result;
};

exports['get project by id'] = function (test) {
    var result = service.getProjectById(liqueedid);
    
    test.ok(result);
    test.equal(result.name, 'liqueed');
    test.equal(result.id, liqueedid);
};

exports['get people in empty project'] = function (test) {
    var result = service.getTeam(liqueedid);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['add person and get people in project'] = function (test) {
    var alanid = sperson.addPerson({ name: 'Alan' });
    service.addPersonToTeam(liqueedid, alanid);
    var result = service.getTeam(liqueedid);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].id, alanid);
    test.equal(result[0].name, 'Alan');
};

exports['get projects'] = function (test) {
    var result = service.getProjects();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.ok(result.length);
};

exports['get no periods from project'] = function (test) {
    var result = service.getPeriods(liqueedid);
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['add period to project'] = function (test) {
    periodid = service.addPeriod(liqueedid, { name: 'First period', date: '2014-01-01', amount: 100 });
    test.ok(periodid);
    
    var result = service.getPeriods(liqueedid);
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'First period');
    test.equal(result[0].date, '2014-01-01');
    test.equal(result[0].amount, 100);
};

exports['get period'] = function (test) {
    var result = service.getPeriod(periodid);
    
    test.ok(result);
    test.equal(result.name, 'First period');
    test.equal(result.date, '2014-01-01');
};

exports['get no assignments'] = function (test) {
    var result = service.getAssignments(periodid);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

