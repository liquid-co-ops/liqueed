
var service = require('../services/project');

var liqueedid;

exports['add project'] = function (test) {
    var result = service.addProject({ name: 'liqueedid' });
    
    test.ok(result);
    liqueedid = result;
};

exports['get project by id'] = function (test) {
    var result = service.getProjectById(liqueedid);
    
    test.ok(result);
    test.equal(result.name, 'liqueedid');
    test.equal(result.id, liqueedid);
};

exports['get people in empty project'] = function (test) {
    var result = service.getProjectTeam(liqueedid);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['add person and get people in project'] = function (test) {
    service.addPersonToProject(liqueedid, 1);
    var result = service.getProjectTeam(liqueedid);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].person, 1);
};
