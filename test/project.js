
var service = require('../services/project');
var sperson = require('../services/person');

var liqueedid;
var periodid;
var alanid;
var cymentid;

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
    alanid = sperson.addPerson({ name: 'Alan' });
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
    var result = service.getPeriodById(periodid);
    
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

exports['put assignment'] = function (test) {
    cymentid = sperson.addPerson({ name: 'Cyment' });

    var result = service.putAssignment(liqueedid, periodid, alanid, cymentid, 50);
    
    test.ok(result);
    
    var list = service.getAssignments(periodid);
    
    test.ok(list);
    test.ok(Array.isArray(list));
    test.equal(list.length, 1);
    
    test.equal(list[0].from.id, alanid);
    test.equal(list[0].from.name, 'Alan');
    test.equal(list[0].to.id, cymentid);
    test.equal(list[0].to.name, 'Cyment');
    test.equal(list[0].amount, 50);
};

exports['put same assignment different amount'] = function (test) {
    var result = service.putAssignment(liqueedid, periodid, alanid, cymentid, 40);
    
    test.ok(result);
    
    var list = service.getAssignments(periodid);
    
    test.ok(list);
    test.ok(Array.isArray(list));
    test.equal(list.length, 1);
    
    test.equal(list[0].from.id, alanid);
    test.equal(list[0].from.name, 'Alan');
    test.equal(list[0].to.id, cymentid);
    test.equal(list[0].to.name, 'Cyment');
    test.equal(list[0].amount, 40);
};


